import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllLines, LineaSelect } from "@/api/LineasAPI";
import { getAllSkus, SKUSelect } from "@/api/SkusAPI";
import { createNewTaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Error from "./Error";
import Spinner from "./Spinner";

export type DraftNewTaskProduction = {
    sku_id: string,
    line_id: string,
    operation_date: string,
    total_hours: number,
    tarimas: number
}

export default function ModalCrearTareaProduccion() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newTask = queryParams.get('newTask')!;
    const show = newTask ? true : false;

    const params = useParams();
    const plan_id = params.plan_id!!;

    const queryClient = useQueryClient();

    const [lineas, setLineas] = useState<LineaSelect[]>([]);
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
        onSuccess: () => {
            toast.success('Tarea Creada Correctamente');
            queryClient.invalidateQueries({queryKey:['getAllTasksForCalendar',plan_id]});
            navigate(location.pathname);
            reset();
        }
    });
    const results = useQueries({
        queries: [
            { queryKey: ['getAllLines'], queryFn: getAllLines },
            { queryKey: ['getAllSkus'], queryFn: getAllSkus }
        ]
    });

    useEffect(() => {
        if (results[0].data) setLineas(results[0].data);
        if (results[1].data) setSkus(results[1].data);
    }, [results])

    const isLoading = results.some(result => result.isLoading);

    const onSubmit = (data: DraftNewTaskProduction) => mutate(data);

    if (isLoading) return <Spinner />
    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                navigate(location.pathname);
            }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        Creación de Tarea Producción
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => navigate(location.pathname)}
                                    >
                                        ✕
                                    </button>
                                </div>

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
                                                    onChange={(selected) => field.onChange(selected?.value)}
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
                                                    value={lineas.find(
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
                                        <label className="text-lg font-bold uppercase" htmlFor="operation_date">
                                            Fecha de operación:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="operation_date"
                                            type="date"
                                            className="border border-black p-3"
                                            {...register('operation_date', {
                                                required: 'La fecha de operación es obligatoria',
                                            })}
                                        />
                                        {errors.operation_date?.message && <Error>{errors.operation_date.message.toString()}</Error>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-bold uppercase" htmlFor="total_hours">
                                            Horas Totales:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="total_hours"
                                            type="number"
                                            placeholder="Total de horas"
                                            className="border border-black p-3"
                                            {...register('total_hours', {
                                                required: 'Las horas totales son obligatorias',
                                            })}
                                        />
                                        {errors.total_hours?.message && <Error>{errors.total_hours.message.toString()}</Error>}
                                    </div>


                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-bold uppercase" htmlFor="tarimas">
                                            Número de Tarimas:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="tarimas"
                                            type="number"
                                            placeholder="Número de Tarimas Totales a Producir"
                                            className="border border-black p-3"
                                            {...register('tarimas', {
                                                required: 'Las horas totales son obligatorias',
                                            })}
                                        />
                                        {errors.tarimas?.message && <Error>{errors.tarimas.message.toString()}</Error>}
                                    </div>


                                    <Button
                                        disabled={isPending}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ marginTop: 2 }}
                                    >
                                        {isPending ? (
                                            <Spinner />
                                        ) : (
                                            <p className="font-bold text-lg">Crear Tarea Producción</p>
                                        )}
                                    </Button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
