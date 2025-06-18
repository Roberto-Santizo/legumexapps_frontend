import { Dispatch, FormEvent, SetStateAction, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCurrentDate } from "@/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { updateTaskProductionOperationDate } from "@/api/TaskProductionPlansAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";

type Props = {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  selectedId: string;
}

export type DraftChangeOperationDate = {
  date: string;
  reason: string;
}

export default function ModalChangeOperationDate({ modal, setModal, selectedId }: Props) {
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const plan_id = params.plan_id!!;
  const reasonRef = useRef<HTMLTextAreaElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateTaskProductionOperationDate,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', date] });
      queryClient.invalidateQueries({ queryKey: ['getAllTasksWeeklyProductionPlan', plan_id] });
      setModal(false);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((reasonRef.current?.value === "" || dateRef.current?.value === "")) {
      toast.error("Todos los datos son requeridos");
      return;
    } else if (reasonRef.current?.value && reasonRef.current?.value.length < 15) {
      toast.error("La razón del cambio debe tener al menos 10 caracteres");
      return;
    }

    if (reasonRef.current?.value && dateRef.current?.value) {
      const FormData: DraftChangeOperationDate = {
        date: dateRef.current?.value,
        reason: reasonRef.current?.value
      }

      mutate({ id: selectedId, FormData });
    }

  }
  return (
    <Modal modal={modal} closeModal={() => setModal(false)} title="Cambio de Fecha Operación">
      <form className="w-full p-10 mx-auto space-y-5" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="code">
            Fecha Destino:
          </label>
          <input ref={dateRef} type="date" className="p-2 border border-gray-300" min={getCurrentDate()} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="code">
            Razón del Cambio:
          </label>
          <textarea ref={reasonRef} className="border border-gray-300 rounded-md p-2 w-full" placeholder="Escriba la razón del cambio de fecha">
          </textarea>
        </div>

        <button type="submit" className="button w-full mt-5 bg-indigo-500 hover:bg-indigo-600">
          {isPending ? <Spinner /> : <p>Realizar Cambio</p>}
        </button>
      </form>
    </Modal>

  )
}
