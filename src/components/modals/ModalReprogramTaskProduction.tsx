import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ChangeEvent, useMemo, useState } from "react";
import { DraftNewTaskProduction } from "./ModalCrearTareaProduccion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewTasksProduction, deleteTaskProduction, getTaskProductionReprogramDetails } from "@/api/TaskProductionPlansAPI";
import { getCurrentDate } from "@/helpers";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useAppStore } from "@/store";

export default function ModalReprogramTaskProduction() {
    const location = useLocation();
    const params = useParams<{ plan_id: string }>();
    const plan_id = params.plan_id!!;
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('reprogramTask')!;
    const show = (taskId) ? true : false;

    const [newTasks, setNewTasks] = useState<DraftNewTaskProduction[]>([]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);

    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("reprogramTask");
        navigate(`${location.pathname}?${searchParams.toString()}`);
        reset();
        setNewTasks([]);
    }


    const { data: task } = useQuery({
        queryKey: ['getTaskProductionReprogramDetails', taskId],
        queryFn: () => getTaskProductionReprogramDetails({ taskId }),
        enabled: !!taskId
    });


    const { mutate: deleteTask } = useMutation({
        mutationFn: deleteTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
            queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });
        }
    });

    const { mutate } = useMutation({
        mutationFn: createNewTasksProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);

            if (task) {
                deleteTask({ taskId: task.id });
            }
        }
    });

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
    } = useForm<{ days: string }>();

    const disabled = useMemo(() => {
        return newTasks.some(task => Number(task.total_lbs) === 0)
    }, [newTasks]);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTasks((prev) =>
            prev.map((task, index) =>
                index === Number(e.target.id)
                    ? { ...task, [e.target.name]: e.target.value } : task
            )
        );
    }

    const handleReprogramTasks = () => {
        const total_lbs = newTasks.reduce((acc, task) => acc + Number(task.total_lbs), 0);

        if (task && total_lbs != task?.total_lbs) {
            toast.error('Las libras divididas no coinciden con el total de la tarea');
            return;
        }

        mutate({ FormData: newTasks, id: plan_id });
    }

    const onSubmit = (data: { days: string }) => {
        const days = data.days;
        setNewTasks([]);
        for (let index = 0; index < +days; index++) {
            if (task) {
                const newTask: DraftNewTaskProduction = {
                    sku_id: task.sku_id,
                    line_id: task.line_id,
                    destination: task.destination,
                    operation_date: getCurrentDate(),
                    total_lbs: 0
                }

                setNewTasks((prev) => [...prev, newTask]);
            }
        }
    }


    if (task) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Reprogramación de Tarea">
            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="flex flex-col">
                        <label className="text-lg font-bold uppercase text-gray-700" >Número de días</label>
                        <input
                            {...register('days', {
                                required: 'El número de días es requerido',
                                min: { value: 2, message: 'El valor minimo es 2' },
                                max: { value: 7, message: 'El valor maximo es 7' }
                            })}
                            placeholder="Número de días a reprogramar"
                            type="number"
                            className="border border-gray-300 rounded-sm p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400"
                        />

                        {errors.days && (
                            <span className="text-red-600 text-sm mt-1">{errors.days.message}</span>
                        )}
                    </div>

                    <button type="submit" className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {false ? <Spinner /> : <p>Dividir</p>}
                    </button>
                </form>

                {newTasks.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 mt-6">
                        {newTasks.map((newTask, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-medium">Destino</span>
                                        <span className="text-gray-800">{newTask.destination}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-medium">Línea</span>
                                        <span className="text-gray-800">{task.line}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-medium">SKU</span>
                                        <span className="text-gray-800">{task.sku}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1 font-medium">Total Libras</label>
                                        <input
                                            type="number"
                                            name="total_lbs"
                                            id={index.toString()}
                                            value={newTask.total_lbs}
                                            onChange={(e) => handleChangeInput(e)}
                                            placeholder="Libras para tarea"
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1 font-medium">Fecha de operación</label>
                                        <input
                                            type="date"
                                            name="operation_date"
                                            min={getCurrentDate()}
                                            id={index.toString()}
                                            value={newTask.operation_date}
                                            onChange={(e) => handleChangeInput(e)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => handleReprogramTasks()} disabled={disabled} type="submit" className={`${disabled ? 'cursor-not-allowed bg-indigo-500/40' : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'} button w-full`}>
                            {false ? <Spinner /> : <p>Reprogramar tarea</p>}
                        </button>
                    </div>
                )}

            </div>
        </Modal>
    )
}
