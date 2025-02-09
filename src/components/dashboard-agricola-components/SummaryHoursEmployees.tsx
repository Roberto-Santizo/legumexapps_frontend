import { CheckIcon, XIcon } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import { SummaryEmployeeHours } from "../../types";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

type Props = {
  week: number;
}

export default function SummaryHoursEmployees({week}: Props) {
  const [employees, setEmployees] = useState<SummaryEmployeeHours[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getSummaryHoursEmployees = useAppStore(
    (state) => state.getSummaryHoursEmployees
  );

  const handleGetData = async () => {
    setLoading(true);
    try {
      const summary = await getSummaryHoursEmployees();
      setEmployees(summary);
    } catch (error) {
      toast.error("Hubo un error al cargar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <div className="flex flex-col items-center shadow-xl row-start-1 col-start-6 col-span-7 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Resumen de Horas Por Empleado Semana {week}
      </p>
      {loading && <Spinner />}
      {!loading && (
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
                    {employee.assigned ? (<CheckIcon className="bg-green-500 rounded text-white p-0.5"/>) : (<XIcon className="bg-red-500 rounded text-white p-0.5"/> )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
