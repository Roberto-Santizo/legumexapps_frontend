import DronHours from "../../components/dashboard-agricola-components/DronHours";
import SummaryHoursEmployees from "../../components/dashboard-agricola-components/SummaryHoursEmployees";
import { getWeekNumber } from "../../helpers";
import TasksInProgress from "../../components/dashboard-agricola-components/TasksInProgress";
import FinishedTasks from "../../components/dashboard-agricola-components/FinishedTasks";
import TasksCropInProgress from "../../components/dashboard-agricola-components/TasksCropInProgress";
import FinishedTasksCrop from "../../components/dashboard-agricola-components/FinishedTasksCrop";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

export default function AgricolaDashboard() {
  const week = getWeekNumber();
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  useEffect(() => {
    const handleGetUserRoleByToken = async () => {
      try {
        const userRole = await getUserRoleByToken();
        setRole(userRole);
      } catch (error) {
        toast.error("Hubo un error al cargar el contenido");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleGetUserRoleByToken();
  }, []);
  return (
    <div>
      <h1 className="text-5xl font-bold mb-10">Dashboard Agricola</h1>

      <div className="mt-10 grid grid-cols-12 gap-5">
        {loading && <Spinner />}

        {!loading && (
          <>
            <DronHours />
            {(role === 'admin' || role === 'adminagricola') &&(
              <SummaryHoursEmployees week={week} />
            )}
            <TasksInProgress />
            <FinishedTasks />
            <TasksCropInProgress />
            <FinishedTasksCrop />
          </>
        )}
      </div>
    </div>
  );
}
