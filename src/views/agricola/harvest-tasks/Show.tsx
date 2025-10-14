import { useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { getCropDailyEmployees } from "@/api/TaskCropWeeklyPlanAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function Show() {
  const params = useParams();
  const task_crop_id = params.task_crop_id!;

  const { data: employeesCrop, isLoading, isError } = useQuery({
    queryKey: ['getCropDailyEmployees', task_crop_id],
    queryFn: () => getCropDailyEmployees(task_crop_id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  if(employeesCrop) return (
    <>
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
    </>
  );
}
