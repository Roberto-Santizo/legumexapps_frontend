import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { BoxIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TaskProductionOperationDate } from "@/types/taskProductionPlanTypes";
import { useNotification } from "@/core/notifications/NotificationContext";
import { createPackingMaterialTransaction } from "../api/api";
import { DraftPackingMaterialTransactionItem, DraftTransactionPackingMaterial } from "../types/types";
import SignatureCanvas from "react-signature-canvas";
import Modal from "@/components/Modal";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import SignatureField from "@/components/form/SignatureComponent";
import Spinner from "@/components/utilities-components/Spinner";



type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    task: TaskProductionOperationDate;
    setItems: Dispatch<SetStateAction<DraftPackingMaterialTransactionItem[]>>,
    items: DraftPackingMaterialTransactionItem[]
};


export default function ModalEntregaMaterialEmpaque({ modal, setModal, task, setItems, items }: Props) {
    const responsableSignatureRef = useRef({} as SignatureCanvas);
    const userRef = useRef({} as SignatureCanvas);
    const notify = useNotification();

    const [error, setError] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationFn: createPackingMaterialTransaction,
        onError: (error) => notify.error(error.message),
        onSuccess: (data) => {
            setModal(false);
            notify.success(data);
            task.status_id = '3';
            task.status = 'Lista para ejecución';
            task.color = 'bg-blue-500';
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
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
        setModal(false);
    };

    const onSubmit = (data: DraftTransactionPackingMaterial) => {
        if (items.some(item => item.lote === '')) {
            notify.error('Todos los lotes son requeridos');
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
        <Modal
            modal={modal}
            closeModal={handleCloseModal}
            title="Entrega Material de Empaque"
            width="w-full max-w-5xl"
        >
            <div className="p-4 sm:p-6 md:p-8 space-y-8">
                <h2 className="text-2xl font-bold uppercase text-center text-gray-800">
                    Configuración Empaque
                </h2>

                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ${error ? "border-2 border-red-500 rounded-xl p-4" : ""
                        }`}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-xs mx-auto"
                        >
                            <div className="mb-4 text-blue-500">
                                <BoxIcon className="w-10 h-10" />
                            </div>

                            <p className="text-base font-semibold text-gray-800 mb-1 text-center">
                                {item.name}
                            </p>
                            <p className="text-sm text-gray-500 mb-1 text-center">{item.code}</p>
                            <p className="text-3xl font-bold text-gray-900 mb-2 text-center">
                                {item.quantity}
                            </p>

                            <input
                                type="text"
                                autoComplete="off"
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Digitar lote"
                                id={item.packing_material_id}
                                onChange={handleChangeLote}
                                value={item.lote}
                            />
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputComponent
                            label="Referencia"
                            id="reference"
                            name="reference"
                            placeholder="Referencia de Transferencia"
                            register={register}
                            validation={{ required: "El referencia de transferencia es requerida" }}
                            errors={errors}
                            type="text"
                        >
                            {errors.reference && (
                                <Error>{errors.reference.message?.toString()}</Error>
                            )}
                        </InputComponent>

                        <InputComponent
                            label="Responsable"
                            id="responsable"
                            name="responsable"
                            placeholder="Nombre del Responsable"
                            register={register}
                            validation={{ required: "El nombre es requerido" }}
                            errors={errors}
                            type="text"
                        >
                            {errors.responsable && (
                                <Error>{errors.responsable.message?.toString()}</Error>
                            )}
                        </InputComponent>
                    </div>

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
                        {errors.observations && (
                            <Error>{errors.observations.message?.toString()}</Error>
                        )}
                    </InputComponent>

                    <fieldset className="border rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 px-2">
                            Firmas
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SignatureField
                                label="Firma"
                                name="responsable_signature"
                                control={control}
                                errors={errors}
                                canvasRef={responsableSignatureRef}
                            />
                            <SignatureField
                                label="Firma de bodega"
                                name="user_signature"
                                control={control}
                                errors={errors}
                                canvasRef={userRef}
                            />
                        </div>
                    </fieldset>

                    <button
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 uppercase"
                    >
                        {isPending ? <Spinner /> : "CREAR"}
                    </button>
                </form>
            </div>
        </Modal>
    );

}

