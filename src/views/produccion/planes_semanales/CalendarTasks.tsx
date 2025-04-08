import { getAllTasksForCalendar, getTotalHoursByDate, TaskForCalendar } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalCrearTareaProduccion from "@/components/modals/ModalCrearTareaProduccion";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import TasksOrder from "@/components/produccion/TasksOrder";
import HoverCardColorDictionary from "@/components/ui/HoverCardColorDictionary";
import FullCalendarComponent from "@/components/produccion/FullCalendarComponent";

export default function CalendarTasks() {
  const params = useParams();
  const plan_id = params.plan_id!!;

  const [events, setEvents] = useState<TaskForCalendar[]>([]);
  const navigate = useNavigate();

  const { data: DataEvents, isLoading, isError } = useQuery({
    queryKey: ['getAllTasksForCalendar', plan_id],
    queryFn: () => getAllTasksForCalendar(plan_id)
  });

  const { data: hoursByDates } = useQuery({
    queryKey: ['getTotalHoursByDate', plan_id],
    queryFn: () => getTotalHoursByDate(plan_id),
  });

  useEffect(() => {
    if (DataEvents) {
      setEvents(DataEvents)
    }
  }, [DataEvents]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (DataEvents && hoursByDates) return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex justify-center items-center gap-5">
          <h1 className="text-4xl font-bold">Tareas Programadas</h1>
          <HoverCardColorDictionary />
        </div>
        <button type="button" className="button bg-indigo-500 flex justify-end hover:bg-indigo-600"
          onClick={() => {
            navigate(`${location.pathname}?newTask=true`);
          }}
        >
          <PlusIcon />
          <p>Crear Tarea</p>
        </button>

      </div>

      <div className="my-10">
        <FullCalendarComponent events={events} setEvents={setEvents} hoursByDates={hoursByDates} />
      </div>

      <TasksOrder />

      <ModalCrearTareaProduccion />

    </div>
  )
}
