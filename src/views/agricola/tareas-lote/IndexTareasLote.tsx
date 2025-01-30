import { useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import Task from "../../../components/Task";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { TasksWeeklyPlan } from "../../../types";

export default function IndexTareasLote() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TasksWeeklyPlan>({} as TasksWeeklyPlan);

  //ASYNC FUNCTION
  const getTasks = useAppStore((state) => state.getTasks);

  const handleGetTasks = async () =>{
    setLoading(true);
    try {
      if (lote_plantation_control_id && weekly_plan_id) {
        const tasks = await getTasks(lote_plantation_control_id, weekly_plan_id);
        setTasks(tasks);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetTasks();
  }, []);

  return (
    <>
      {(!loading && !error) && <h2 className="font-bold text-3xl">Plan Semanal Semana {tasks.week} - FINCA {tasks.finca} - LOTE {tasks?.lote}</h2>}
      {loading && <Spinner />}
      {(!loading && error) && <ShowErrorAPI />}
      <div className="flex flex-col gap-10 mt-10">
        {(!loading && !error && tasks.data) && (
          tasks.data.map(task => <Task key={task.id} task={task} />)
        )}
      </div>
    </>
  )
}
