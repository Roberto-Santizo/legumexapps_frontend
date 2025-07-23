import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getTaskProductionInProgressDetails } from "@/api/TaskProductionPlansAPI";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import GraphicsPlanSemanal, { graphDataType } from "./GraphicsPlanSemanal";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function TaskProductionPlanDetails() {
  const params = useParams();
  const task_p_id = params.task_p_id!!;
  const [graphData, setGraphData] = useState<graphDataType>({} as graphDataType);

  const { data: task, isLoading, isError, } = useQuery({
    queryKey: ["getTaskProductionInProgressDetail", task_p_id],
    queryFn: () => getTaskProductionInProgressDetails(task_p_id),
    refetchInterval: 10000
  });

  useEffect(() => {
    if (task) {
      setGraphData({
        HPlan: task.HPlan,
        HLinea: task.HLinea,
        HRendimiento: task.HRendimiento,
        HTiemposMuertos: task.HTiemposMuertos
      })
    }
  }, [task])

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (task)
    return (
      <div className="p-4 sm:p-6 md:p-8 xl:p-10 space-y-10">
        <h2 className="font-bold text-2xl sm:text-3xl xl:text-4xl text-center sm:text-left text-gray-800">
          Información de Tarea
        </h2>

        <div className="text-base sm:text-lg xl:text-2xl font-semibold text-gray-700">
          SKU: <span className="font-normal text-gray-900">{task.sku}</span>
        </div>

        <div className="grid gap-10 xl:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase">Información de Rendimientos</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Fecha de Toma</th>
                  <th className="thead-th">Tarimas Producidas</th>
                  <th className="thead-th">Libras Báscula</th>
                </tr>
              </thead>
              <tbody>
                {task.performances.map(performance => (
                  <tr key={performance.id} className="tbody-tr">
                    <td className="tbody-td">{performance.take_date}</td>
                    <td className="tbody-td">{performance.tarimas_produced ?? 0}</td>
                    <td className="tbody-td">{performance.lbs_bascula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <div className="w-24 sm:w-36 md:w-40 lg:w-60">
              <CircularProgressbar
                value={task.percentage}
                text={`${task.percentage.toString()}%`}
                styles={buildStyles({
                  pathColor: "#3B82F6",
                  trailColor: "#F3F4F6",
                  textColor: "#1F2937",
                  textSize: "10px",
                })}
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Porcentaje de Cumplimiento</h2>
              <p className="text-sm text-gray-600">Tarimas producidas: <span className="font-semibold text-gray-800">{task.total_tarimas}</span></p>
              <p className="text-sm text-gray-600">Libras Producidas: <span className="font-semibold text-gray-800">{task.total_produced}</span></p>
              <p className="text-sm text-gray-600">Libras totales: <span className="font-semibold text-gray-800">{task.total_lbs}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 xl:col-span-2 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase">Información de Tiempos Muertos</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Tiempo Muerto</th>
                  <th className="thead-th">Fecha de Inicio</th>
                  <th className="thead-th">Fecha Final</th>
                  <th className="thead-th">Horas Totales</th>
                </tr>
              </thead>
              <tbody>
                {task.timeouts.map(timeout => (
                  <tr key={timeout.id} className="tbody-tr">
                    <td className="tbody-td">{timeout.name}</td>
                    <td className="tbody-td">{timeout.start_date}</td>
                    <td className="tbody-td">{timeout.end_date ?? 'SIN CIERRE'}</td>
                    <td className="tbody-td">{timeout.total_hours ?? 'SIN HORAS'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 uppercase">Empleados Asignados</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="thead-tr">
                <th className="thead-th">Código</th>
                <th className="thead-th">Nombre</th>
                <th className="thead-th">Posición</th>
              </tr>
            </thead>
            <tbody>
              {task.employees.map((employee) => (
                <tr key={employee.id} className="tbody-tr">
                  <td className="tbody-td">{employee.code}</td>
                  <td className="tbody-td">{employee.name}</td>
                  <td className="tbody-td">{employee.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <GraphicsPlanSemanal graphData={graphData} />
        </div>
      </div>

    );
}


