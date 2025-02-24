import { useParams } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";

//COMPONENTES
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import Task from "@/components/Task";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function IndexTareasLote() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const [error, setError] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false);
  const loadingReloadTasks = useAppStore((state) => state.loadingReloadTasks);
  const tasks = useAppStore((state) => state.tasksWeeklyPlan);
  const getTasks = useAppStore((state) => state.getTasks);

  const [role, setRole] = useState<string>("");
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const handleGetUserRole = async () => {
    setLoading(true);
    try {
      const role = await getUserRoleByToken();
      setRole(role);
    } catch (error) {
      toast.error("Error al cargar el contenido");
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTasks = async () => {
    try {
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasks(lote_plantation_control_id, weekly_plan_id);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    handleGetTasks();
    handleGetUserRole();
  }, []);

  return (
    <>
      {!loading && !error && (
        <h2 className="font-bold text-3xl">
          Plan Semanal Semana {tasks.week} - FINCA {tasks.finca} - LOTE{" "}
          {tasks?.lote}
        </h2>
      )}
      {loading && <Spinner />}
      {!loadingReloadTasks && !loading && error && <ShowErrorAPI />}
      <div className="flex flex-col gap-10 mt-10">
        {!loading &&
          !error &&
          tasks.data &&
          tasks.data.map((task) => <Task key={task.id} task={task} role={role}/>)}
      </div>
    </>
  );
}
