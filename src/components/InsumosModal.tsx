import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from "react";
import { useAppStore } from "../stores/useAppStore";
import { TaskInsumo, TaskWeeklyPlan } from "../types";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";

export default function InsumosModal() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingClose, setLoadingClose] = useState<boolean>(false);
  const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
  const [taskInsumos, setTaskInsumo] = useState<TaskInsumo[]>([]);
  const modal = useAppStore((state) => state.OpenModalInsumos);
  const closeModal = useAppStore((state) => state.closeModalAction);
  const getTask = useAppStore((state) => state.getTask);
  const idTask = useAppStore((state) => state.idTask);
  const registerUsedInsumos = useAppStore((state) => state.registerUsedInsumos);
  const closeTask = useAppStore((state) => state.closeTask);
  const getTasks = useAppStore((state) => state.getTasks);
  const hasValidData = useMemo(
    () =>
      taskInsumos.some(
        (item) => item.used_quantity === null || item.used_quantity === 0
      ),
    [taskInsumos]
  );

  const handleGetTask = async () => {
    setLoading(true);
    try {
      if (idTask) {
        const task = await getTask(idTask);
        setTask(task);
        setTaskInsumo(task.insumos);
      }
    } catch (error) {
      toast.error("Error al traer la tarea, intentelo de nuevo más tarde");
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTask();
  }, [idTask]);

  const handleChange = (
    id: TaskInsumo["id"],
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (value <= 0) {
      toast.error("La cantidad utilizada debe de ser mayor a 0");
      return;
    }
    setTaskInsumo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, used_quantity: +e.target.value } : item
      )
    );
  };

  const SaveData = async () => {
    setLoadingClose(true);
    try {
      await registerUsedInsumos(taskInsumos);
      await closeTask(task.id);
      toast.success("Asignación cerrada correctamente");
      closeModal();
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasks(lote_plantation_control_id,weekly_plan_id);
      }
    } catch (error) {
      toast.error(
        "Hubo un error al registrar los datos de insumos, intentelo de nuevo más tarde"
      );
    } finally {
      setLoadingClose(false);
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  {loading && <Spinner />}
                  {!loading && taskInsumos && (
                    <>
                      <h2 className="font-bold text-xl mb-5">{task.task}</h2>
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
                        disabled={hasValidData || loadingClose}
                        className={`mt-10 w-full ${
                          hasValidData
                            ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                            : "button bg-indigo-500 hover:bg-indigo-800"
                        }`}
                        onClick={() => SaveData()}
                      >
                        {loadingClose ? (
                          <Spinner />
                        ) : (
                          <p className="font-bold text-lg">Cerrar Asignación</p>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
