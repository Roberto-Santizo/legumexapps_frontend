import { Dispatch, SetStateAction, useState } from "react";
import { HoursByDate, TaskForCalendar } from "@/api/WeeklyProductionPlanAPI";
import { useNavigate } from "react-router-dom";
import { EventDropArg } from "@fullcalendar/core/index.js";
import { getCurrentDate } from "@/helpers";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Swal from "sweetalert2";
import ModalChangeOperationDate from "../modals/ModalChangeOperationDate";

type Props = {
  events: TaskForCalendar[];
  setEvents: Dispatch<SetStateAction<TaskForCalendar[]>>;
  hoursByDates: HoursByDate[]
}

export default function FullCalendarComponent({ events, setEvents, hoursByDates }: Props) {

  const [modal, setModal] = useState<boolean>(false);
  const [info, setInfo] = useState<EventDropArg | null>(null);
  const navigate = useNavigate();

  const handleEventDrop = async (info: EventDropArg) => {
    const total_hours = hoursByDates.find(item => item.date === info.event.startStr && item.line_id === info.event.extendedProps.line_id)?.total_hours || 0;
    const today = getCurrentDate();
    const newTotalHours = total_hours + info.event.extendedProps.total_hours;
    setInfo(info);

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
          setModal(true);
        } else {
          info.revert();
        }
      });
    };

    if (today === info.event.startStr) {
      if (newTotalHours > 12) {
        showConfirmation(
          "¿Estás seguro que quieres mover esta tarea?",
          `El día destino es hoy y contará con ${newTotalHours} horas totales. Esto podría afectar la operación.`
        );
      } else {
        showConfirmation(
          "¿Estás seguro que quieres mover esta tarea?",
          "Mover una tarea hacia el día actual podría afectar la operación"
        );
      }
    } else if (newTotalHours > 12) {
      showConfirmation(
        "¿Estás seguro que quieres mover esta tarea?",
        `El día destino contará con ${newTotalHours} horas totales`
      );
    } else {
      setModal(true);
    }

  };


  interface DateClickInfo {
    dateStr: string;
  }

  const handleOpenDate = (info: DateClickInfo) => {
    navigate(`${location.pathname}?date=${info.dateStr}`);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        locale={esLocale}
        eventDrop={handleEventDrop}
        eventOrder="line_id"
        dateClick={handleOpenDate}
        eventAllow={(dropInfo) => {
          const today = getCurrentDate()
          return dropInfo.startStr >= today;
        }}
      />

      {info && (
        <ModalChangeOperationDate modal={modal} setModal={setModal} setEvents={setEvents} info={info} events={events} setInfo={setInfo} />
      )}
    </>
  );
}
