import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { TaskForCalendar, updateTaskProductionOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { EventDropArg } from "@fullcalendar/core/index.js";
import Spinner from "@/components/utilities-components/Spinner";

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
    <Transition appear show={modal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => handleCloseModal()}>
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
              <Dialog.Panel className="relative transform overflow-hidden bg-white shadow-xl sm:w-full sm:max-w-3xl">
                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                  <h3 className="text-xl font-bold uppercase">
                    Formulario Razón de Cambio de Fecha
                  </h3>
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={() => handleCloseModal()}
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <form action="" className="w-full p-10 mx-auto" onSubmit={(e) => handleSubmit(e)}>
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
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  )
}
