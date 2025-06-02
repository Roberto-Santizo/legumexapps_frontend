import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getLinesBySkuId } from "@/api/LineasAPI";
import { createNewTaskProduction, getTotalHoursByDate } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate, getCurrentDate } from "@/helpers";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Swal from "sweetalert2";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import InputComponent from "../form/InputComponent";

export type DraftNewTaskProduction = {
    sku_id: string,
    line_id: string,
    operation_date: string,
    total_lbs: number,
    destination: string;
}

export default function ModalCrearTareaProduccion() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newTask = queryParams.get('newTask')!;
    const show = newTask ? true : false;

    const params = useParams();
    const plan_id = params.plan_id!!;

    const [skuId, setSkuId] = useState<string>('');

    const { data: hoursByDates } = useQuery({
        queryKey: ['getTotalHoursByDate', plan_id],
        queryFn: () => getTotalHoursByDate(plan_id),
    });

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', skuId],
        queryFn: () => getLinesBySkuId(skuId),
        enabled: !!skuId
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset
    } = useForm<DraftNewTaskProduction>();

    const { mutate, isPending } = useMutation({
        mutationFn: createNewTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getAllTasksForCalendar', plan_id] });
            navigate(location.pathname);
            reset();
        }
    });

    const onSubmit = (data: DraftNewTaskProduction) => {
        if (hoursByDates) {
            const total_hours = hoursByDates.find(item => item.date === data.operation_date && item.line_id === data.line_id)?.total_hours || 0;
            const performance = lineas?.find(item => item.value === data.line_id);
            if (performance?.performance) {
                const newHours = Math.round((data.total_lbs / performance.performance) + total_hours);
                if (newHours > 12) {
                    Swal.fire({
                        title: '¿Desea crear la tarea?',
                        text: `La linea ${performance.label} contará con ${newHours} horas en fecha ${formatDate(data.operation_date)}`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Si, crear",
                        cancelButtonText: "Cancelar"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            mutate(data);
                        }
                    });
                } else {
                    mutate(data);
                }
            } else {
                mutate(data);
            }

        }
    };

    if (hoursByDates) return (
        <Modal modal={show} closeModal={() => navigate(location.pathname)} title="Creación de Tarea Produccion Extraordinaria">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectSearchComponent<DraftNewTaskProduction>
                    label="SKU"
                    id="sku_id"
                    name="sku_id"
                    options={[]}
                    control={control}
                    rules={{ required: 'Seleccione un SKU' }}
                    errors={errors}
                    onChange={(value) => setSkuId(value ?? '')}
                >
                    {errors.sku_id && <Error>{errors.sku_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <InputSelectSearchComponent<DraftNewTaskProduction>
                    label="Linea"
                    id="line_id"
                    name="line_id"
                    options={lineas || []}
                    control={control}
                    rules={{ required: 'Seleccione una linea' }}
                    errors={errors}
                >
                    {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Total de Libras"
                    id="total_lbs"
                    name="total_lbs"
                    placeholder="Total de Libras"
                    register={register}
                    validation={{ required: 'Las libras totales son obligatorias' }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_lbs && <Error>{errors.total_lbs?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Destino"
                    id="destination"
                    name="destination"
                    placeholder="Nombre del Destino"
                    register={register}
                    validation={{ required: 'El destino es requerido' }}
                    errors={errors}
                    type={'text'}
                >
                    {errors.destination && <Error>{errors.destination?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Fecha de Operación"
                    id="operation_date"
                    name="operation_date"
                    placeholder=""
                    register={register}
                    validation={{ required: 'La fecha de operación es obligatoria' }}
                    errors={errors}
                    type={'date'}
                    min={getCurrentDate()}
                >
                    {errors.operation_date && <Error>{errors.operation_date?.message?.toString()}</Error>}
                </InputComponent>

                <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Crear Tarea Producción</p>}
                </button>
            </form>
        </Modal>
    )
}
