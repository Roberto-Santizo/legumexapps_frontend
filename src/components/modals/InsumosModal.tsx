import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TaskInsumo } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { closeTask, getTask, registerUsedInsumos } from "@/api/TasksWeeklyPlanAPI";
import { toast } from "react-toastify";
import { FiltersTareasLoteType } from "@/views/agricola/lote-tasks/Index";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import Modal from "../Modal";
import { TaskWeeklyPlan } from "types/taskWeeklyPlanTypes";

type Props = {
  filters: FiltersTareasLoteType;
}

export default function InsumosModal({ filters }: Props) {
  const params = useParams();
  const lote_plantation_control_id = params.lote_plantation_control_id!!;
  const weekly_plan_id = params.weekly_plan_id!!;
  const queryClient = useQueryClient();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('closeTaskId')!;
  const show = taskId ? true : false;

  const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
  const [taskInsumos, setTaskInsumo] = useState<TaskInsumo[]>([]);

  const navigate = useNavigate();

  const { mutate: mutationCloseTask, isPending } = useMutation({
    mutationFn: closeTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], });
      navigate(location.pathname, { replace: true });
    }
  });

  const { mutate: mutationRegisterUsedInsumos } = useMutation({
    mutationFn: registerUsedInsumos,
    onError: (error) => {
      toast.error(error.message)
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getTask', taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId
  });

  useEffect(() => {
    if (data) {
      setTask(data);
      setTaskInsumo(data.insumos);
    }
  }, [data]);

  const handleChange = (id: TaskInsumo["id"], e: ChangeEvent<HTMLInputElement>) => {
    setTaskInsumo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, used_quantity: +e.target.value } : item
      )
    );
  };
  const hasValidData = useMemo(() =>
    taskInsumos.some(
      (item) => item.used_quantity === null
    ), [taskInsumos]);

  const SaveData = async () => {
    mutationRegisterUsedInsumos(taskInsumos);
    mutationCloseTask(task.id);
  };

  return (
    <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Recuento de Insumos Utilizados">
      {isError && <ShowErrorAPI />}
      {isLoading ? <Spinner /> : (
        <div className="p-10">
          <h2 className="font-bold text-xl mb-5">{task.task} - {task.lote}</h2>
          <div className="space-y-6">
            {taskInsumos.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 rounded-lg shadow-md p-5 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm">
                    <span className="font-bold">Insumo:</span>{" "}
                    {item.name}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <input
                    type="number"
                    placeholder={`Cantidad ${item.measure}`}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    onChange={(e) => handleChange(item.id, e)}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            disabled={hasValidData}
            className={`mt-10 w-full ${hasValidData
              ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
              : "button bg-indigo-500 hover:bg-indigo-800"
              }`}
            onClick={() => SaveData()}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Cerrar Asignación</p>
            )}
          </button>
        </div>
      )}

    </Modal>

  );
}
