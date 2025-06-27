import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { BoxIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPackingMaterialTransaction } from "@/api/PackingMaterialTransactions";
import { DraftTaskProductionWastage } from "./ModalAddWastage";
import { TaskProductionOperationDate } from "types/taskProductionPlanTypes";
import InputComponent from "../form/InputComponent";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "../form/SignatureComponent";
import { TasksWithOperationDateFilters } from "../produccion/TasksWithOperationDate";

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
    wastages: DraftTaskProductionWastage[];
    type: string;
}

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    task: TaskProductionOperationDate;
};


export default function ModalEntregaMaterialEmpaque({ modal, setModal, task }: Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date')!;
    const queryClient = useQueryClient();
    const responsableSignatureRef = useRef({} as SignatureCanvas);
    const userRef = useRef({} as SignatureCanvas);
    const params = useParams();
    const plan_id = params.plan_id!!;

    const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>(task.recipe);
    const [error, setError] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationFn: createPackingMaterialTransaction,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            setModal(false);
            toast.success(data);
            reset();
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', date,plan_id, {} as TasksWithOperationDateFilters] });
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
        data.wastages = [];
        mutate(data);
    }

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title="Entrega Material de Empaque" width="w-2/3">
            <div className="p-8 space-y-8">
                <h2 className="text-2xl font-bold uppercase text-center text-gray-800">Configuración Empaque</h2>

                <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 ${error ? 'border-2 border-red-500 rounded-xl p-4' : ''}`}>
                    {task.recipe.map((item, index) => (
                        <div key={index} className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-xs mx-auto">
                            <div className="mb-4 text-blue-500">
                                <BoxIcon className="w-10 h-10" />
                            </div>

                            <p className="text-base font-semibold text-gray-800 mb-1 text-center">{item.name}</p>
                            <p className="text-sm text-gray-500 mb-1 text-center">{item.code}</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2 text-center">{item.quantity}</p>

                            <input
                                type="text"
                                autoComplete="off"
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Digitar lote"
                                id={item.packing_material_id}
                                onChange={handleChangeLote}
                            />
                        </div>
                    ))}
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

