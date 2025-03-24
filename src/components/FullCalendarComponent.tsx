import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAllTasksForCalendar, TaskForCalendar, TaskProduction, updateTaskProductionOperationDate } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "./Spinner";
import ShowErrorAPI from "./ShowErrorAPI";
import { toast } from "react-toastify";

type Event = {
  id: string;
  title: string;
  start: string;
  priority: string;
}

type EventDropInfo = {
  event: {
    id: string;
    startStr: string;
  };
}

type Props = {
  setModalTasks: Dispatch<SetStateAction<boolean>>;
  setDate: Dispatch<SetStateAction<string>>;
}
export default function CustomCalendar({ setModalTasks, setDate }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const [events, setEvents] = useState<TaskForCalendar[]>([]);

  const { mutate } = useMutation({
    mutationFn: ({id,date} : {id:TaskProduction['id'], date:string}) => updateTaskProductionOperationDate(id,date),
    onError: () =>{
      toast.error('Hubo un error al actualizar la tarea');
    },
    onSuccess: () =>{
      toast.success('Fecha de operacion actualizada correctamente');
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllTasksForCalendar', plan_id],
    queryFn: () => getAllTasksForCalendar(plan_id)
  });

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);

  const handleEventDrop = (info: EventDropInfo) => {
    const updatedEvents = events.map((event: Event) =>
      event.id === info.event.id ? { ...event, start: info.event.startStr } : event
    );
    setEvents(updatedEvents);

    mutate({ id: info.event.id, date: info.event.startStr });
  };

  interface DateClickInfo {
    dateStr: string;
  }

  const handleOpenDate = (info: DateClickInfo) => {
    setDate(info.dateStr);
    setModalTasks(true);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (events) return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      locale={esLocale}
      eventDrop={handleEventDrop}
      dateClick={handleOpenDate}
    />
  );
}
