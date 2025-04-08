import { CheckIcon, XIcon } from "lucide-react";
import Spinner from "../utilities-components/Spinner";
import { getSummaryHoursEmployees } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";

export default function SummaryHoursEmployees() {
  const { data: employees, isError, isLoading } = useQuery({
    queryKey: ['getSummaryHoursEmployees'],
    queryFn: getSummaryHoursEmployees
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (employees) return (
    <div className="flex flex-col items-center shadow-xl row-start-2 col-start-6 col-span-7 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Resumen de Horas Por Empleado Semana
      </p>
      <div className="w-full p-2 h-96 overflow-y-scroll">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                Codigo
              </th>
              <th scope="col" className="thead-th">
                Empleado
              </th>
              <th scope="col" className="thead-th">
                Total de Horas
              </th>
              <th scope="col" className="thead-th">
                Activo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="tbody-td">{employee.code}</td>
                <td className="tbody-td">{employee.first_name}</td>
                <td className="tbody-td">{employee.weekly_hours} horas</td>
                <td>
                  {employee.assigned ? (<CheckIcon className="bg-green-500 rounded text-white p-0.5" />) : (<XIcon className="bg-red-500 rounded text-white p-0.5" />)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
