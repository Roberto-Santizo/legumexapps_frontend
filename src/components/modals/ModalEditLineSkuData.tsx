import { Dispatch, SetStateAction, useEffect } from "react";
import { LinePerformance } from "@/types/linePerformanceTypes";
import { updateLineaSku } from "@/api/LinesPerformanceAPI";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../core/notifications/NotificationContext";
import { usePermissions } from "@/hooks/usePermissions";
import Error from "../utilities-components/Error";
import InputComponent from "../form/InputComponent";
import InputSelectComponent from "../form/InputSelectComponent";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    sku: LinePerformance;
    setSelectedSku: Dispatch<SetStateAction<LinePerformance>>;
    currentPage: number;
}

const paymentMethodOptions = [
    {
        value: '0',
        label: 'Horas Rendimiento'
    },
    {
        value: '1',
        label: 'Horas Linea'
    }
];

const statusOptions = [
    {
        value: '0',
        label: 'Inactivo'
    },
    {
        value: '1',
        label: 'Activo'
    }
];

export type DraftEditLineSku = Pick<LinePerformance, 'accepted_percentage' | 'performance' | 'payment_method' | 'status'>;

export default function ModalEditLineSkuData({ modal, setModal, sku, setSelectedSku, currentPage }: Props) {
    const queryClient = useQueryClient();
    const notify = useNotification();
    const { hasPermission } = usePermissions();

    const { mutate, isPending } = useMutation({
        mutationFn: updateLineaSku,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess(data) {
            notify.success(data);
            setModal(false);
            setSelectedSku({} as LinePerformance);
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
            setValue('status', sku.status);
        }
    }, [sku]);

    const handleCloseModal = () => {
        setModal(false);
        setSelectedSku({} as LinePerformance);
    }

    const onSubmit = (data: DraftEditLineSku) => {
        if (!data.performance && data.payment_method.toString() === '0') {
            notify.error('El metodo de pago no coincide con el rendimiento asociado');
            return;
        }

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
                    options={paymentMethodOptions}
                    register={register}
                    validation={{ required: 'El metodo de pago es requerido' }}
                    errors={errors}
                >
                    {errors.payment_method && <Error>{errors.payment_method?.message?.toString()}</Error>}
                </InputSelectComponent>

                <InputSelectComponent<DraftEditLineSku>
                    label="Estado"
                    id="status"
                    name="status"
                    options={statusOptions}
                    register={register}
                    validation={{ required: 'El estado requerido' }}
                    errors={errors}
                >
                    {errors.status && <Error>{errors.status?.message?.toString()}</Error>}
                </InputSelectComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    );
}
