import { LineaSKU, updateLineaSku } from "@/api/LineasSkuAPI";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/usePermissions";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    sku: LineaSKU;
    setSelectedSku: Dispatch<SetStateAction<LineaSKU>>;
    currentPage: number;
}

export type DraftEditLineSku = Pick<LineaSKU, 'accepted_percentage' | 'performance'>;

export default function ModalEditLineSkuData({ modal, setModal, sku, setSelectedSku, currentPage }: Props) {
    const queryClient = useQueryClient();
    const { hasPermission } = usePermissions();

    const { mutate, isPending } = useMutation({
        mutationFn: updateLineaSku,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess(data) {
            toast.success(data);
            setModal(false);
            setSelectedSku({} as LineaSKU);
            queryClient.invalidateQueries({ queryKey: ['getPaginatedLineasSKU', currentPage] })
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<DraftEditLineSku>();


    useEffect(() => {
        if (sku) {
            setValue('accepted_percentage', sku.accepted_percentage);
            setValue('performance', sku.performance);
        }
    }, [sku]);

    const handleCloseModal = () => {
        setModal(false);
        setSelectedSku({} as LineaSKU);
    }

    const onSubmit = (data: DraftEditLineSku) => mutate({ FormData: data, id: sku.id });

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title={`${sku.sku} - ${sku.line}`}>
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="performance">
                        Libras/Horas:
                    </label>
                    <input
                        autoComplete="off"
                        id="performance"
                        type="number"
                        placeholder={"Rendiento en lbs"}
                        className="border border-black p-3"
                        {...register("performance", {
                            min: { value: 0, message: 'El valor debe de ser mayor a 0' }
                        })}
                    />
                    {errors.performance && <Error>{errors.performance?.message?.toString()}</Error>}
                </div>

                {hasPermission('can update sku percentage') && (
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-bold uppercase" htmlFor="accepted_percentage">
                            Porcentaje Aceptado:
                        </label>
                        <input
                            autoComplete="off"
                            id="accepted_percentage"
                            type="number"
                            placeholder={"Rendiento en lbs"}
                            className="border border-black p-3"
                            {...register("accepted_percentage", {
                                required: "El porcentaje aceptado es requerido",
                                min: { value: 0, message: 'El valor debe de ser mayor a 0' }
                            })}
                        />
                        {errors.accepted_percentage && <Error>{errors.accepted_percentage?.message?.toString()}</Error>}
                    </div>
                )}

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    );
}
