import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Dispatch, Fragment, useEffect, useMemo, useState } from "react";
import { TaskInsumo, TasksWeeklyPlan, TaskWeeklyPlan } from "../types";
import Spinner from "./Spinner";
import { QueryObserverResult, useQuery, useMutation } from "@tanstack/react-query";
import { closeTask, getTask, registerUsedInsumos } from "@/api/TasksWeeklyPlanAPI";
import { toast } from "react-toastify";
import ShowErrorAPI from "./ShowErrorAPI";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  getTasks: () => Promise<QueryObserverResult<TasksWeeklyPlan>>;
  idTask: TaskWeeklyPlan['id'];
}

export default function InsumosModal({ isOpen, setIsOpen, getTasks, idTask }: Props) {
  const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
  const [taskInsumos, setTaskInsumo] = useState<TaskInsumo[]>([]);

  const { mutate: mutationCloseTask, isPending } = useMutation({
    mutationFn: closeTask,
    onError: () => {
      toast.error('Hubo un error al cerrar la tarea');
    },
    onSuccess: () => {
      toast.success('Se cerro la tarea correctamente');
      setIsOpen(false);
      getTasks();
    }
  });

  const { mutate: mutationRegisterUsedInsumos } = useMutation({
    mutationFn: registerUsedInsumos,
    onError: () => {
      toast.error('Hubo un error registrar lo insumos')
    },
  });

  const { data,isLoading,isError } = useQuery({
      queryKey:['getTask',idTask],
      queryFn: () => getTask(idTask)
  });

  useEffect(()=>{
    if(data){
      setTask(data);
      setTaskInsumo(data.insumos);
    }
  },[data]);

  const handleChange = (id: TaskInsumo["id"],e: ChangeEvent<HTMLInputElement>) => {
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

  useEffect(()=>{
    console.log(taskInsumos);
  },[taskInsumos])

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { setIsOpen(false) }}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                <div className="p-10">
                  <>
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
                  </>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
