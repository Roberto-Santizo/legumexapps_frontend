import { LineaSKU, updateLineaSku } from "@/api/LineasSkuAPI";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/usePermissions";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import InputSelectComponent from "../form/InputSelectComponent";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    sku: LineaSKU;
    setSelectedSku: Dispatch<SetStateAction<LineaSKU>>;
    currentPage: number;
}

export type DraftEditLineSku = Pick<LineaSKU, 'accepted_percentage' | 'performance' | 'payment_method'>;

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
            setValue('payment_method', sku.payment_method);
        }
    }, [sku]);

    const handleCloseModal = () => {
        setModal(false);
        setSelectedSku({} as LineaSKU);
    }

    const options = [
        {
            value: '0',
            label: 'Horas Rendimiento'
        },
        {
            value: '1',
            label: 'Horas Linea'
        }
    ];
    const onSubmit = (data: DraftEditLineSku) => {
        mutate({ FormData: data, id: sku.id })
    };

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title={`${sku.sku ?? ''} - ${sku.line ?? ''}`}>
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputComponent<DraftEditLineSku>
                    label="Libras/Horas"
                    id="performance"
                    name="performance"
                    placeholder="Rendimiento en LBS"
                    register={register}
                    validation={{}}
                    errors={errors}
                    type={'number'}
                >
                    {errors.performance && <Error>{errors.performance?.message?.toString()}</Error>}
                </InputComponent>

                {hasPermission('can update sku percentage') && (
                    <InputComponent<DraftEditLineSku>
                        label="Porcentaje Aceptado"
                        id="accepted_percentage"
                        name="accepted_percentage"
                        placeholder="Porcentaje Aceptado"
                        register={register}
                        validation={{}}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.accepted_percentage && <Error>{errors.accepted_percentage?.message?.toString()}</Error>}
                    </InputComponent>
                )}

                <InputSelectComponent<DraftEditLineSku>
                    label="Método de pago"
                    id="payment_method"
                    name="payment_method"
                    options={options}
                    register={register}
                    validation={{ required: 'El metodo de pago es requerido' }}
                    errors={errors}
                >
                    {errors.payment_method && <Error>{errors.payment_method?.message?.toString()}</Error>}
                </InputSelectComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    );
}
