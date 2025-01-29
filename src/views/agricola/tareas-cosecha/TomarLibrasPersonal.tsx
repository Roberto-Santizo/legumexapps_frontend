import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { formatDate } from "../../../helpers";
import { EmployeeCrop } from "../../../types";
import EmployeeTaskCrop from "../../../components/EmployeeTaskCrop";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function TomarLibrasPersonal() {
  const { task_crop_id } = useParams();
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";
  const getCropEmployees = useAppStore((state) => state.getCropEmployees);
  const loadingGetEmployees = useAppStore((state) => state.loadingGetEmployees);
  const CropEmployees = useAppStore((state) => state.CropEmployees);
  const errorgetEmployees = useAppStore((state) => state.errorgetEmployees);
  const closeDailyAssignment = useAppStore(
    (state) => state.closeDailyAssignment
  );
  const loadingCloseTask = useAppStore((state) => state.loadingCloseTask);

  const navigate = useNavigate();

  const [dataEmployees, setDataEmployees] = useState<EmployeeCrop[]>([]);
  const [plants, setPlants] = useState<number>(0);
  useEffect(() => {
    if (task_crop_id) {
      getCropEmployees(task_crop_id);
    }
  }, []);

  useEffect(() => {
    setDataEmployees(CropEmployees.data);
  }, [CropEmployees]);

  const hasValidData = useMemo(
    () =>
      Array.isArray(dataEmployees) &&
      dataEmployees.every((assignment) => assignment.lbs !== null) &&
      plants > 0,
    [dataEmployees, plants]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;

    setPlants(value);
  };

  const handleSaveAssignment = () => {
    if (plants <= 0) {
      toast.error("Las plantas cosechadas deben ser mayor a 0");
      return;
    }

    if (task_crop_id) {
      try {
        closeDailyAssignment(task_crop_id, dataEmployees, plants).then(() => {
          navigate(previousUrl);
          toast.success('Datos Guardados Correctamente');
        });
      } catch (error) {
        toast.error('Hubo un error al guardar la asignación, intentelo de nuevo más tarde');
      }
    }
  };
  return (
    <>
      {loadingGetEmployees && <Spinner />}
      {!loadingGetEmployees && !errorgetEmployees && dataEmployees && (
        <>
          <div>
            <p className="font-bold text-3xl">
              {CropEmployees.finca} - {CropEmployees.task} - Semana{" "}
              {CropEmployees.week}
            </p>
            <div className="text-xl font-medium">
              {CropEmployees.date_assignment ? (
                formatDate(CropEmployees.date_assignment)
              ) : (
                <Spinner />
              )}
            </div>
            <p className="font-medium uppercase text-red-500 flex gap-2 justify-end">
              <AlertCircle />
              Tener en cuenta que los datos se toman en libras
            </p>
          </div>

          <div className="my-10 flex gap-5 justify-between">
            <input
              type="number"
              placeholder="Plantas Cosechadas"
              min={1}
              className="p-3 border w-1/2 border-black rounded"
              onChange={handleChange}
            />

            <button
              disabled={!hasValidData}
              className={`${
                !hasValidData
                  ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                  : "button bg-indigo-500 hover:bg-indigo-800"
              }`}
              onClick={() => handleSaveAssignment()}
            >
              {loadingCloseTask ? (
                <Spinner />
              ) : (
                <p className="font-bold text-lg">Guardar Asignación</p>
              )}
            </button>
          </div>

          <div className="mt-10 space-y-5">
            {dataEmployees.map((assignment) => (
              <EmployeeTaskCrop
                key={assignment.id}
                assignment={assignment}
                setDataEmployees={setDataEmployees}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
