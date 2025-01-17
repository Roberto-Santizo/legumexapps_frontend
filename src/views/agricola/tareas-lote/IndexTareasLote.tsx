import { useLocation, useParams } from "react-router-dom"
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import Task from "../../../components/Task";
import { TaskWeeklyPlan } from "../../../types";

export default function IndexTareasLote() {
    const { id } = useParams();
    const location = useLocation();
    const [tasks, setTasks] = useState<TaskWeeklyPlan[]>([]);
    const previousUrl = location.state?.previousUrl || "/";
    const plan = location.state?.plan;
    const fetchTasks = useAppStore((state) => state.fetchTasks);
    const loadingFetchTasks = useAppStore((state) => state.loadingFetchTasks);
    const getTasks = async () => {
      if(id){
        setTasks(await fetchTasks(id));
      }
    }
    useEffect(() => {
      getTasks();
    },[]);

  return (
    <>
      <h2>Plan Semanal Semana{plan.data.week}</h2>
      <ReturnLink url={previousUrl}/>
      {loadingFetchTasks && <Spinner />}

      <div className="flex flex-col gap-10 mt-10">
        {(!loadingFetchTasks) && (
          tasks.map(task => <Task key={task.id} task={task}/>)
        )}
      </div>
    </>
  )
}
