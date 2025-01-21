import { useLocation, useParams } from "react-router-dom"
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";

//COMPONENTES
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Spinner from "../../../components/Spinner";
import Task from "../../../components/Task";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexTareasLote() {
    const { id } = useParams();
    const location = useLocation();
    const previousUrl = location.state?.previousUrl || "/";
    const fetchTasks = useAppStore((state) => state.fetchTasks);
    const tasks = useAppStore((state) => state.tasks);
    const errorLoadingFetchTasks = useAppStore((state) => state.errorLoadingFetchTasks);
    const loadingFetchTasks = useAppStore((state) => state.loadingFetchTasks);
   
    useEffect(() => {
      if(id){
        fetchTasks(id);
      }
    },[]);

  return (
    <>
      {(!loadingFetchTasks && !errorLoadingFetchTasks) && <h2 className="font-bold text-3xl">Plan Semanal Semana {tasks?.week} - FINCA {tasks?.finca} - LOTE {tasks?.lote}</h2>}
      <ReturnLink url={previousUrl}/>
      {loadingFetchTasks && <Spinner />}
      {(!loadingFetchTasks && errorLoadingFetchTasks) && <ShowErrorAPI />}
      <div className="flex flex-col gap-10 mt-10">
        {(!loadingFetchTasks && !errorLoadingFetchTasks) && (
          tasks?.data.map(task => <Task key={task.id} task={task} id={id}/>)
        )}
      </div>
    </>
  )
}
