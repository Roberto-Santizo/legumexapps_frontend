import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { EmployeeCrop } from "@/types/index";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { closeDailyAssignment, getCropEmployees } from "@/api/TaskCropWeeklyPlanAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import EmployeeTaskCrop from "@/components/tareas-lote-plan/EmployeeTaskCrop";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function PersonalPerformance() {
  const params = useParams();
  const task_crop_id = params.task_crop_id!;
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";
  const [dataEmployees, setDataEmployees] = useState<EmployeeCrop[]>([]);
  const [plants, setPlants] = useState<number>(0);
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ task_crop_id, dataEmployees, plants }: { task_crop_id: string, dataEmployees: EmployeeCrop[], plants: number }) => closeDailyAssignment(task_crop_id, dataEmployees, plants),
    onError: () => {
      notify.error("Hubo un error al cerrar la asignación, intentelo de nuevo más tarde");
    },
    onSuccess: () => {
      navigate(previousUrl);
      notify.success("Datos Guardados Correctamente");
    }
  });

  const { data: CropEmployees, isLoading, isError } = useQuery({
    queryKey: ['getCropEmployees', task_crop_id],
    queryFn: () => getCropEmployees(task_crop_id),
  });

  useEffect(() => {
    if (CropEmployees?.data) {
      setDataEmployees(CropEmployees.data);
    }
  }, [CropEmployees]);


  const hasValidData = useMemo(() =>
    Array.isArray(dataEmployees) &&
    dataEmployees.every((assignment) => assignment.lbs !== null) &&
    plants > 0,
    [dataEmployees, plants]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;

    setPlants(value);
  };

  const handleSaveAssignment = async () => {
    if (plants <= 0) {
      notify.error("Las plantas cosechadas deben ser mayor a 0");
      return;
    }

    mutate({ task_crop_id, dataEmployees, plants });

  };

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (CropEmployees) return (
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
          className={`${!hasValidData
            ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
            : "button bg-indigo-500 hover:bg-indigo-800"
            }`}
          onClick={() => handleSaveAssignment()}
        >
          {isPending ? (
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
  );
}
