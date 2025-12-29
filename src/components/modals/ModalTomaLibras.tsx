import { ChangeEvent, Dispatch, useEffect, useMemo, useState } from "react";
import { TaskCropIncomplete, TasksCropWeeklyPlan } from "@/types/index";
import { formatDate } from "@/helpers";
import { completeAssigments, getIncompleteAssigments } from "@/api/TaskCropWeeklyPlanAPI";
import { QueryObserverResult, useQuery, useMutation } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import Modal from "../Modal";
import { useNotification } from "../../core/notifications/NotificationContext";


type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
  id: string;
  refetch: () => Promise<QueryObserverResult<TasksCropWeeklyPlan>>;
}

export default function ModalTomaLibras({ isOpen, setIsOpen, id, refetch }: Props) {
  const [incompleteAssigments, setIncompleteAssigments] = useState<TaskCropIncomplete[]>([]);
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: completeAssigments,
    onError: () => {
      notify.error('Hubo un error al registrar las libras, intentelo de nuevo más tarde');
    },
    onSuccess: () => {
      notify.success("Registro Guardado Correctamente");
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
      notify.error("Las libras ingresdasadas deben ser mayor a 0");
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
    <Modal modal={isOpen} closeModal={() => setIsOpen(false)} title="Ingreso de Libras Finca">
      <div className="p-6">
        {isLoading && <Spinner />}
        {isError && <ShowErrorAPI />}
        {(!isLoading && incompleteAssigments.length) === 0 && (
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
    </Modal>
  );
}
