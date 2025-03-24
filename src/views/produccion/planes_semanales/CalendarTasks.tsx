import FullCalendarComponent from "@/components/FullCalendarComponent";
import TasksOrder from "@/components/TasksOrder";
import { PlusIcon } from "lucide-react";
import { useState } from "react";


export default function CalendarTasks() {
  const [modalTasks, setModalTasks] = useState<boolean>(false);
  const [date, setDate] = useState<string>('');

  return (
    <div>

      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-10">Tareas Programadas</h1>
        <button type="button" className="button bg-indigo-500 flex justify-end hover:bg-indigo-600">
          <PlusIcon />
          <p>Crear Tarea</p>
        </button>
      </div>

      <FullCalendarComponent setModalTasks={setModalTasks} setDate={setDate} />

      {modalTasks && (
        <TasksOrder setModalTasks={setModalTasks} date={date} />
      )}
    </div>
  )
}
