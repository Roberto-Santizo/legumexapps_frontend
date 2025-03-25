import { getAllTasksForCalendar, TaskForCalendar } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendarComponent from "@/components/FullCalendarComponent";
import ModalCrearTareaProduccion from "@/components/ModalCrearTareaProduccion";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";
import TasksOrder from "@/components/TasksOrder";

export default function CalendarTasks() {
  const params = useParams();
  const plan_id = params.plan_id!!;

  const [events, setEvents] = useState<TaskForCalendar[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllTasksForCalendar', plan_id],
    queryFn: () => getAllTasksForCalendar(plan_id)
  });

  useEffect(() => {
    if (data) {
      setEvents(data)
    }
  }, [data]);


  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (data) return (
    <div>

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-10">Tareas Programadas</h1>
        <button type="button" className="button bg-indigo-500 flex justify-end hover:bg-indigo-600" onClick={() => {
          navigate(`${location.pathname}?newTask=true`);
        }}>
          <PlusIcon />
          <p>Crear Tarea</p>
        </button>
      </div>

      <FullCalendarComponent events={events} setEvents={setEvents} />

      <TasksOrder />

      <ModalCrearTareaProduccion />
      
    </div>
  )
}
