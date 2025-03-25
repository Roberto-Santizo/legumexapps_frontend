import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskForCalendar, TaskProduction, updateTaskProductionOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { EventDropArg } from "@fullcalendar/core/index.js";

type Props = {
  events: TaskForCalendar[];
  setEvents: Dispatch<SetStateAction<TaskForCalendar[]>>;
}


export default function CustomCalendar({ events, setEvents }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ id, date }: { id: TaskProduction['id'], date: string }) => updateTaskProductionOperationDate(id, date),
  });

  const handleEventDrop = (info: EventDropArg) => {
    const today = new Date().toISOString().split("T")[0];

    if (info.event.startStr < today) {
      info.revert(); 
      toast.error("No puedes mover eventos a fechas pasadas.");
      return;
    }

    mutate({ id: info.event.id, date: info.event.startStr },
      {
        onSuccess: () => {
          const updatedEvents = events.map((event: TaskForCalendar) =>
            event.id === info.event.id
              ? { ...event, start: info.event.startStr, backgroundColor: event.backgroundColor, editable: event.editable }
              : event
          );
          setEvents(updatedEvents);
          queryClient.invalidateQueries({ queryKey: ['getAllTasksForCalendar', plan_id] });
          toast.success('Tarea Actualizada Correctamente');
        },
        onError: (error) => {
          info.revert();
          toast.error(error.message);
        }
      }
    );
  };


  interface DateClickInfo {
    dateStr: string;
  }

  const handleOpenDate = (info: DateClickInfo) => {
    navigate(`${location.pathname}?date=${info.dateStr}`);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      locale={esLocale}
      eventDrop={handleEventDrop}
      eventOrder="priority"
      dateClick={handleOpenDate}
      eventAllow={(dropInfo) => {
        const today = new Date().toISOString().split("T")[0];
        return dropInfo.startStr >= today;
      }}
    />
  );
}
