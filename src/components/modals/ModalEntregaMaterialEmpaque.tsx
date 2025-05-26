import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { TaskOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { Package, Layers, Box } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPackingMaterialTransaction } from "@/api/PackingMaterialTransactions";
import InputComponent from "../form/InputComponent";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "../form/SignatureComponent";

export type DraftPackingMaterialTransactionItem = {
    packing_material_id: string;
    name: string;
    quantity: number;
    lote: string;
    destination: string | null;
}

export type DraftTransactionPackingMaterial = {
    task_production_plan_id: string;
    reference: string;
    responsable: string;
    responsable_signature: string;
    user_signature: string;
    observations: string;
    items: DraftPackingMaterialTransactionItem[];
    type: string;
}

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    task: TaskOperationDate;
};


export default function ModalEntregaMaterialEmpaque({ modal, setModal, task }: Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date')!;
    const queryClient = useQueryClient();
    const responsableSignatureRef = useRef({} as SignatureCanvas);
    const userRef = useRef({} as SignatureCanvas);
    const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>(task.recipe);
    const [error, setError] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationFn: createPackingMaterialTransaction,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            setModal(false);
            toast.success(data);
            reset();
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', date] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
    } = useForm<DraftTransactionPackingMaterial>();

    const handleChangeLote = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const updatedItems = items.map(item => {
            if (item.packing_material_id === id) {
                return { ...item, lote: value };
            }
            return item;
        });
        setItems(updatedItems);
    }

    const handleCloseModal = () => {
        reset();
        setModal(false);
    };

    const onSubmit = (data: DraftTransactionPackingMaterial) => {
        if (items.some(item => item.lote === '')) {
            toast.error('Todos los lotes son requeridos');
            setError(true)
            return;
        } else {
            setError(false);
        }

        data.items = items;
        data.task_production_plan_id = task.id;
        data.type = "1";
        mutate(data);
    }

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title="Entrega Material de Empaque" width="w-2/3">
            <div className="p-8 space-y-8">
                <h2 className="text-2xl font-bold uppercase text-center text-gray-800">Configuración Empaque</h2>

                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${error ? 'border-2 border-red-500 rounded-xl p-4' : ''}`}>
                    {[task.box, task.bag, task.bag_inner].map((label, i) => {
                        const icons = [<Box className="text-indigo-500" />, <Package className="text-green-500" />, <Layers className="text-purple-500" />];
                        const ringColors = ['focus:ring-indigo-400', 'focus:ring-green-400', 'focus:ring-purple-400'];

                        return (
                            <div key={i} className="flex flex-col items-center bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="w-8 h-8 mb-3">{icons[i]}</div>
                                <p className="text-sm text-gray-500 mb-1">{label}</p>
                                <p className="text-2xl font-semibold text-gray-800">{task.recipe[i].quantity}</p>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    className={`mt-4 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${ringColors[i]}`}
                                    placeholder="Digitar lote"
                                    id={task.recipe[i].packing_material_id}
                                    onChange={handleChangeLote}
                                />
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        <InputComponent
                            label="Referencia"
                            id="reference"
                            name="reference"
                            placeholder="Referencia de Transferencia"
                            register={register}
                            validation={{ required: 'El referencia de transferencia es requerida' }}
                            errors={errors}
                            type="text"
                        >
                            {errors.reference && <Error>{errors.reference.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent
                            label="Responsable"
                            id="responsable"
                            name="responsable"
                            placeholder="Nombre del Responsable"
                            register={register}
                            validation={{ required: 'El nombre es requerido' }}
                            errors={errors}
                            type="text"
                        >
                            {errors.responsable && <Error>{errors.responsable.message?.toString()}</Error>}
                        </InputComponent>
                    </div>

                    <fieldset className="border rounded-xl p-6 shadow-sm space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 px-2">Firmas</legend>
                        <div className="grid grid-cols-2">
                            <SignatureField label="Firma" name="responsable_signature" control={control} errors={errors} canvasRef={responsableSignatureRef} />
                            <SignatureField label="Firma de bodega" name="user_signature" control={control} errors={errors} canvasRef={userRef} />
                        </div>
                    </fieldset>

                    <InputComponent
                        label="Observaciones"
                        id="observations"
                        name="observations"
                        placeholder="Observaciones Generales"
                        register={register}
                        validation={{}}
                        errors={errors}
                        type="text"
                    >
                        {errors.observations && <Error>{errors.observations.message?.toString()}</Error>}
                    </InputComponent>

                    <button
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 uppercase"
                    >
                        {isPending ? <Spinner /> : 'CREAR'}
                    </button>
                </form>
            </div>
        </Modal>

    );
}

