import { useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EmployeesCrop } from "../../../types";
import Spinner from "../../../components/Spinner";
import { formatDate } from "../../../helpers";

export default function InformacionTareaCosechaLote() {
  const { task_crop_id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [employeesCrop, setEmployeesCrop] = useState<EmployeesCrop>(
    {} as EmployeesCrop
  );
  const getCropDailyEmployees = useAppStore((state) => state.getCropDailyEmployees);

  const handleGetInfo = async () => {
    try {
      if (task_crop_id) {
        const employees = await getCropDailyEmployees(task_crop_id);
        setEmployeesCrop(employees);
      }
    } catch (error) {
      toast.error("Error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);
  return (
    <>
      <h2 className="font-bold text-4xl">Información Tarea Cosecha</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-5 space-y-5">
          <div className="p-5 shadow">
            <p>
              <span className="font-bold">Finca:</span> {employeesCrop.finca}
            </p>
            <p>
              <span className="font-bold">Día:</span>{" "}
              {formatDate(employeesCrop.date_assignment)}
            </p>
          </div>

          <div>
            <table className="table">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Nombre</th>
                  <th className="thead-th">Codigo</th>
                  
                </tr>
              </thead>
              <tbody>
                {employeesCrop.data.map((employee) => (
                  <tr key={employee.id} className="tbody-tr">
                    <td className="tbody-td">{employee.name}</td>
                    <td className="tbody-td">{employee.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
