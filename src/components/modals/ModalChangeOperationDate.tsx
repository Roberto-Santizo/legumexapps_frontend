import { Dispatch, SetStateAction, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { TaskForCalendar, updateTaskProductionOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { EventDropArg } from "@fullcalendar/core/index.js";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";

type Props = {
  modal: boolean;
  setEvents: Dispatch<SetStateAction<TaskForCalendar[]>>;
  setModal: Dispatch<SetStateAction<boolean>>;
  setInfo: Dispatch<SetStateAction<EventDropArg | null>>;
  info: EventDropArg;
  events: TaskForCalendar[];
}

export type DraftChangeOperationDate = {
  date: string;
  reason: string;
}

export default function ModalChangeOperationDate({ modal, setModal, info, setEvents, events, setInfo }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const queryClient = useQueryClient();
  const reasonRef = useRef<HTMLTextAreaElement | null>(null);


  const { mutate, isPending } = useMutation({
    mutationFn: updateTaskProductionOperationDate,
  });

  const handleCloseModal = () => {
    setModal(false);
    setInfo(null);
    info.revert();
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (reasonRef.current?.value === "") {
      toast.error("La razón del cambio es requerida");
      return;
    } else if (reasonRef.current?.value && reasonRef.current?.value.length < 15) {
      toast.error("La razón del cambio debe tener al menos 10 caracteres");
      return;
    }

    if (reasonRef.current?.value) {
      const FormData: DraftChangeOperationDate = {
        date: info.event.startStr,
        reason: reasonRef.current?.value,
      }

      mutate({ id: info.event.id, FormData: FormData }, {
        onSuccess: () => {
          setEvents(events.map(event =>
            event.id === info.event.id
              ? { ...event, start: info.event.startStr }
              : event
          ));
          queryClient.invalidateQueries({ queryKey: ['getAllTasksForCalendar', plan_id] });
          queryClient.invalidateQueries({ queryKey: ['getTotalHoursByDate', plan_id] });
          toast.success('Tarea Actualizada Correctamente');
          setModal(false);
        },
        onError: (error) => {
          info.revert();
          toast.error(error.message);
          setModal(false);
        }
      });
    }

  }
  return (
    <Modal modal={modal} closeModal={() => handleCloseModal()} title="Cambio de Fecha Operación">
      <form className="w-full p-10 mx-auto" onSubmit={(e) => handleSubmit(e)}>
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
