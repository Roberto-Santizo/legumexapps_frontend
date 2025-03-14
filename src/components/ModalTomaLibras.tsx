import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Dispatch, Fragment, useEffect, useMemo, useState } from "react";
import { TaskCropIncomplete, TasksCropWeeklyPlan } from "@/types";
import Spinner from "./Spinner";
import { formatDate } from "@/helpers";
import ShowErrorAPI from "./ShowErrorAPI";
import { toast } from "react-toastify";
import { completeAssigments, getIncompleteAssigments } from "@/api/TaskCropWeeklyPlanAPI";
import { QueryObserverResult, useQuery, useMutation } from "@tanstack/react-query";


type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  id: string;
  refetch: () => Promise<QueryObserverResult<TasksCropWeeklyPlan>>;
}

export default function ModalTomaLibras({ isOpen, setIsOpen, id, refetch }: Props) {
  const [incompleteAssigments, setIncompleteAssigments] = useState<TaskCropIncomplete[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: completeAssigments,
    onError: () => {
      toast.error('Hubo un error al registrar las libras, intentelo de nuevo más tarde');
    },
    onSuccess: () => {
      toast.success("Registro Guardado Correctamente");
      refetch();
    }
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getIncompleteAssigments'],
    queryFn: () => getIncompleteAssigments(id)
  });

  useEffect(() => {
    if (data) {
      setIncompleteAssigments(data)
    }
  }, [data])

  const hasValidData = useMemo(
    () =>
      Array.isArray(incompleteAssigments) &&
      incompleteAssigments.some(
        (assignment) =>
          assignment.lbs_planta !== null && assignment.lbs_planta > 0
      ),
    [incompleteAssigments]
  );

  const handleChange = (
    id: TaskCropIncomplete["id"],
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (value <= 0) {
      toast.error("Las libras ingresdasadas deben ser mayor a 0");
      return;
    }
    setIncompleteAssigments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lbs_planta: +e.target.value } : item
      )
    );
  };

  const SaveData = async () => {
    const completedAssigments = incompleteAssigments.filter((item) => item.lbs_planta != null && item.lbs_planta > 0);
    mutate(completedAssigments);
    setIsOpen(false);
  };

  if (incompleteAssigments) return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                  <h3 className="text-xl font-bold uppercase">
                    Toma de Libras Planta
                  </h3>
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={() => setIsOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6">
                  {isLoading && <Spinner />}
                  {isError && <ShowErrorAPI />}
                  {incompleteAssigments.length === 0 && (
                    <p className="text-center font-bold uppercase">No existen datos incompletos</p>
                  )}
                  <div className="space-y-6">
                    {incompleteAssigments.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-100 rounded-lg shadow-md p-5 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-lg font-semibold">
                            Fecha: {formatDate(item.date)}
                          </p>
                          <p className="text-sm">
                            <span className="font-bold">Libras Finca:</span>{" "}
                            {item.lbs_finca} lbs
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <input
                            type="number"
                            placeholder="Libras Planta"
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            onChange={(e) => handleChange(item.id, e)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={!hasValidData}
                    className={`mt-10 w-full ${!hasValidData
                      ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                      : "button bg-indigo-500 hover:bg-indigo-800"
                      }`}
                    onClick={() => SaveData()}
                  >
                    {isPending ? (
                      <Spinner />
                    ) : (
                      <p className="font-bold text-lg">Registrar Libras</p>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
