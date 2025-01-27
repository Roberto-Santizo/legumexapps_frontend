import { useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import Task from "../../../components/Task";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexTareasLote() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();

  //ASYNC FUNCTION
  const getTasks = useAppStore((state) => state.getTasks);

  //STATES
  const errorGetTasks = useAppStore((state) => state.errorGetTasks);
  const loadingGetTasks = useAppStore((state) => state.loadingGetTasks);
  const tasks = useAppStore((state) => state.tasks);

  useEffect(() => {
    if (lote_plantation_control_id && weekly_plan_id) {
      getTasks(lote_plantation_control_id, weekly_plan_id);
    }
  }, []);

  return (
    <>
      {(!loadingGetTasks && !errorGetTasks) && <h2 className="font-bold text-3xl">Plan Semanal Semana {tasks.week} - FINCA {tasks.finca} - LOTE {tasks?.lote}</h2>}
      {loadingGetTasks && <Spinner />}
      {(!loadingGetTasks && errorGetTasks) && <ShowErrorAPI />}
      <div className="flex flex-col gap-10 mt-10">
        {(!loadingGetTasks && !errorGetTasks && tasks.data) && (
          tasks.data.map(task => <Task key={task.id} task={task} />)
        )}
      </div>
    </>
  )
}
