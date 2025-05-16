import { Dispatch, SetStateAction, useRef } from "react";
import { TaskOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { Package, Layers, Box } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPackingMaterialDispatch } from "@/api/PackingMaterialDispatches";
import InputComponent from "../form/InputComponent";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "../form/SignatureComponent";

export type DraftDispatchPackingMaterial = {
    reference: string;
    observations: string;
    received_by_boxes: string;
    received_by_signature_boxes: string;
    received_by_bags: string;
    received_by_signature_bags: string;
    user_signature: string;
    quantity_boxes: number;
    quantity_bags: number;
    quantity_inner_bags: number;
    task_production_plan_id: TaskOperationDate['id'];
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
    const receivedByBoxesRef = useRef({} as SignatureCanvas);
    const receivedByBagsRef = useRef({} as SignatureCanvas);
    const userRef = useRef({} as SignatureCanvas);

    const { mutate, isPending } = useMutation({
        mutationFn: createPackingMaterialDispatch,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            setModal(false);
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', date] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
    } = useForm<DraftDispatchPackingMaterial>();


    const handleCloseModal = () => {
        setModal(false);
    };

    const onSubmit = (data: DraftDispatchPackingMaterial) => {
        data.task_production_plan_id = task.id;
        data.quantity_boxes = task.recipe.config_boxes;
        data.quantity_bags = task.recipe.config_bag;
        data.quantity_inner_bags = task.recipe.config_inner_bag;

        reset();
        mutate(data);
    }

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title="Entrega Material de Empaque">
            <div className="p-6 space-y-6">
                <h2 className="text-xl font-bold uppercase">Configuración Empaque</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm cursor-pointer">
                        <Box className="w-6 h-6 text-indigo-500 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                            {task.box}
                        </p>
                        <p className="text-xl font-semibold text-gray-800">{task.recipe.config_boxes}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm cursor-pointer">
                        <Package className="w-6 h-6 text-green-500 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                            {task.bag}
                        </p>
                        <p className="text-xl font-semibold text-gray-800">{task.recipe.config_bag}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm cursor-pointer">
                        <Layers className="w-6 h-6 text-purple-500 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">
                            {task.bag_inner}
                        </p>
                        <p className="text-xl font-semibold text-gray-800">{task.recipe.config_inner_bag}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputComponent<DraftDispatchPackingMaterial>
                        label="Referencia"
                        id="reference"
                        name="reference"
                        placeholder="Referencia de Transferencia"
                        register={register}
                        validation={{ required: 'El referencia de transferencia es requerida' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.reference && <Error>{errors.reference?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<DraftDispatchPackingMaterial>
                        label="Receptor Cajas"
                        id="received_by_boxes"
                        name="received_by_boxes"
                        placeholder="Nombre de quien recibe cajas"
                        register={register}
                        validation={{ required: 'El nombre requerido' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.received_by_boxes && <Error>{errors.received_by_boxes?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<DraftDispatchPackingMaterial>
                        label="Receptor Bolsas"
                        id="received_by_bags"
                        name="received_by_bags"
                        placeholder="Nombre de quien recibe bolsas"
                        register={register}
                        validation={{ required: 'El nombre requerido' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.received_by_bags && <Error>{errors.received_by_bags?.message?.toString()}</Error>}
                    </InputComponent>

                    <fieldset className="mt-5 border p-5 grid grid-cols-2 gap-2">
                        <legend className="font-bold text-xl">Firmas</legend>

                        <SignatureField label="Firma Receptor Cajas" name="received_by_signature_boxes" control={control} errors={errors} canvasRef={receivedByBoxesRef} />
                        <SignatureField label="Firma Receptor Bolsas" name="received_by_signature_bags" control={control} errors={errors} canvasRef={receivedByBagsRef} />
                        <SignatureField label="Firma De Entrega" name="user_signature" control={control} errors={errors} canvasRef={userRef} />
                    </fieldset>

                    <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                        {isPending ? <Spinner /> : <p>Crear</p>}
                    </button>
                </form>
            </div>
        </Modal>
    );
}

