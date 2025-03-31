import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HoursByDate, TaskForCalendar, TaskProduction, updateTaskProductionOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { EventDropArg } from "@fullcalendar/core/index.js";
import { getCurrentDate } from "@/helpers";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Swal from "sweetalert2";

type Props = {
  events: TaskForCalendar[];
  setEvents: Dispatch<SetStateAction<TaskForCalendar[]>>;
  hoursByDates: HoursByDate[]
}

export default function CustomCalendar({ events, setEvents, hoursByDates }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: ({ id, date }: { id: TaskProduction['id'], date: string }) => updateTaskProductionOperationDate(id, date),
  });

  const handleEventDrop = async (info: EventDropArg) => {
    const total_hours = hoursByDates.find(item => item.date === info.event.startStr && item.line_id === info.event.extendedProps.line_id)?.total_hours || 0;
    const today = getCurrentDate();
    const newTotalHours = total_hours + info.event.extendedProps.total_hours;

    const updateTask = () => {
      mutate({ id: info.event.id, date: info.event.startStr }, {
        onSuccess: () => {
          setEvents(events.map(event =>
            event.id === info.event.id
              ? { ...event, start: info.event.startStr }
              : event
          ));
          queryClient.invalidateQueries({ queryKey: ['getAllTasksForCalendar', plan_id] });
          queryClient.invalidateQueries({ queryKey: ['getTotalHoursByDate', plan_id] });
          toast.success('Tarea Actualizada Correctamente');
        },
        onError: (error) => {
          info.revert();
          toast.error(error.message);
        }
      });
    };

    const showConfirmation = (title: string, text: string) => {
      Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, moverla",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          updateTask();
        } else {
          info.revert();
        }
      });
    };

    if (today === info.event.startStr) {
      showConfirmation(
        "¿Estás seguro que quieres mover esta tarea?",
        "Mover una tarea hacia el día actual podría afectar la operación"
      );
    } else if (newTotalHours > 12) {
      showConfirmation(
        "¿Estás seguro que quieres mover esta tarea?",
        `El día destino contará con ${newTotalHours} horas totales`
      );
    } else {
      updateTask();
    }
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
        const today = getCurrentDate()
        return dropInfo.startStr >= today;
      }}
    />
  );
}
