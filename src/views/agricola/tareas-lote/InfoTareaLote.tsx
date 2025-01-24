import { useLocation, useParams } from "react-router-dom";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { TaskWeeklyPlanDetails } from "../../../types";
import Spinner from "../../../components/Spinner";
import { Trash } from "lucide-react";

export default function InfoTareaLote() {
  const { id } = useParams();
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/dashboard";

  const getTaskDetailsById = useAppStore((state) => state.getTaskDetailsById);
  const loadingGetTaskDetail = useAppStore(
    (state) => state.loadingGetTaskDetail
  );
  const errorGetTaskDetail = useAppStore((state) => state.errorGetTaskDetails);

  const [taskDetail, setTaskDetail] = useState<TaskWeeklyPlanDetails>(
    {} as TaskWeeklyPlanDetails
  );

  useEffect(() => {
    if (id) {
      (async () => {
        const taskDetails = await getTaskDetailsById(id);
        setTaskDetail(taskDetails);
      })();
    }
  }, []);

  return (
    <>
      <h2 className="text-4xl font-bold">Información de Tarea</h2>

      {loadingGetTaskDetail && <Spinner />}
      {!loadingGetTaskDetail && !errorGetTaskDetail && (
        <div className="text-xl space-y-10 mt-5">
          <div className="shadow p-5">
            <h2 className="font-bold text-3xl text-center">
              Información de la tarea
            </h2>

            <div className="grid grid-cols-2 gap-2 justify-between mt-5">
              <div className="grid grid-cols-2 gap-2">
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">Nombre de la Tarea: </span>
                  {taskDetail.task}
                </p>
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">Finca: </span>
                  {taskDetail.finca}
                </p>
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">Semana Calendario: </span>
                  {taskDetail.week}
                </p>
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">Semana de Aplicación: </span>
                  {taskDetail.aplication_week}
                </p>
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">Fecha de Inicio: </span>
                  {taskDetail.start_date}
                </p>
                {taskDetail.end_date && (
                  <>
                    <p className="p-5 shadow bg-gray-200">
                      <span className="font-bold">Fecha Final: </span>
                      {taskDetail.end_date}
                    </p>
                    <p className="p-5 shadow bg-gray-200">
                      <span className="font-bold">
                        Horas Rendimiento Teórico:{" "}
                      </span>
                      {taskDetail.hours}
                    </p>
                    <p className="p-5 shadow bg-gray-200">
                      <span className="font-bold">
                        Horas Rendimiento Real:{" "}
                      </span>
                      {taskDetail.real_hours}
                    </p>
                  </>
                )}
              </div>

              <div className="shadow p-5">
                <h2 className="font-bold text-3xl text-center">
                  Cierres Parciales
                </h2>

                <div>
                  {!taskDetail.closures?.length && (
                    <p className="text-center ">
                      No cuenta con cierres parciales
                    </p>
                  )}

                  {taskDetail.closures?.length > 1 && (
                    <table className="table mt-5">
                      <thead className="bg-gray-400">
                        <tr className="text-xs md:text-sm rounded">
                          <th scope="col" className="table-header">
                            Fecha de Cierre Parcial
                          </th>
                          <th scope="col" className="table-header">
                            Fecha de Reapertura
                          </th>
                        </tr>
                      </thead>
                      <tbody className="table-body">
                        {taskDetail.closures.map((closure) => (
                          <tr>
                            <td className="record">{closure.start_date}</td>
                            <td className="record">{closure.end_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="shadow p-5">
            <h2 className="font-bold text-3xl text-center">
              Empleados Asignados
            </h2>

            <div className="mt-5">
              <table className="table">
                <thead className="bg-gray-400">
                  <tr className="text-xs md:text-sm rounded">
                    <th scope="col" className="table-header">
                      Codigo
                    </th>
                    <th scope="col" className="table-header">
                      Nombre de Usuario
                    </th>
                    <th scope="col" className="table-header">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {taskDetail.employees?.map((employee) => (
                    <tr className="text-xl" key={employee.code}>
                      <td className="record">
                        <p>{employee.code}</p>
                      </td>
                      <td className="record">
                        <p>{employee.name}</p>
                      </td>
                      <td>
                        <Trash />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
