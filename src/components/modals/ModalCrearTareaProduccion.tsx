import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueries, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getLinesBySkuId } from "@/api/LineasAPI";
import { getAllSkus, SKUSelect } from "@/api/SkusAPI";
import { createNewTaskProduction, getTotalHoursByDate } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate, getCurrentDate } from "@/helpers";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Swal from "sweetalert2";
import Modal from "../Modal";

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

    const [skus, setSkus] = useState<SKUSelect[]>([]);
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

    const results = useQueries({
        queries: [
            { queryKey: ['getAllSkus'], queryFn: getAllSkus }
        ]
    });

    useEffect(() => {
        if (results[0].data) setSkus(results[0].data);
    }, [results])

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
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="sku_id">
                        SKU:
                    </label>
                    <Controller
                        name="sku_id"
                        control={control}
                        rules={{ required: "Seleccione un sku" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={skus}
                                id="sku_id"
                                placeholder={"--SELECCIONE UNA OPCION--"}
                                onChange={(selected) => {
                                    if (selected?.value) {
                                        setSkuId(selected?.value);
                                        field.onChange(selected?.value)
                                    }
                                }}
                                value={skus.find(
                                    (option) => option.value === field.value
                                )}
                            />
                        )}
                    />
                    {errors.sku_id && (
                        <Error>{errors.sku_id?.message?.toString()}</Error>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="line_id">
                        Linea:
                    </label>
                    <Controller
                        name="line_id"
                        control={control}
                        rules={{ required: "Seleccione una linea" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={lineas}
                                id="line_id"
                                placeholder={"--SELECCIONE UNA OPCION--"}
                                onChange={(selected) => field.onChange(selected?.value)}
                                value={lineas?.find(
                                    (option) => option.value === field.value
                                )}
                            />
                        )}
                    />
                    {errors.line_id && (
                        <Error>{errors.line_id?.message?.toString()}</Error>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="total_lbs">
                        Total de Libras:
                    </label>
                    <input
                        autoComplete="off"
                        id="total_lbs"
                        type="number"
                        placeholder="Número de libras"
                        className="border border-black p-3"
                        {...register('total_lbs', {
                            required: 'Las libras total son requeridas',
                        })}
                    />
                    {errors.total_lbs?.message && <Error>{errors.total_lbs.message.toString()}</Error>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="destination">
                        Destino:
                    </label>
                    <input
                        autoComplete="off"
                        id="destination"
                        type="text"
                        placeholder="Nombre del Destino"
                        className="border border-black p-3"
                        {...register('destination', {
                            required: 'El destino es requerido',
                        })}
                    />
                    {errors.destination?.message && <Error>{errors.destination.message.toString()}</Error>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="operation_date">
                        Fecha de operación:
                    </label>
                    <input
                        autoComplete="off"
                        id="operation_date"
                        type="date"
                        min={getCurrentDate()}
                        className="border border-black p-3"
                        {...register('operation_date', {
                            required: 'La fecha de operación es obligatoria',
                        })}
                    />
                    {errors.operation_date?.message && <Error>{errors.operation_date.message.toString()}</Error>}
                </div>

                <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Crear Tarea Producción</p>}
                </button>
            </form>
        </Modal>
    )
}
