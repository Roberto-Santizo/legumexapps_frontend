import { useParams } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import { Trash } from "lucide-react";
import DronIcon from "@/components/dashboard-agricola/DronIcon";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import { getTaskDetailsById } from "@/api/TasksWeeklyPlanAPI";

export default function InfoTareaLote() {
  const params = useParams();
  const id = params.id!!;
  const { data: taskDetail, isLoading, isError } = useQuery({
    queryKey: ['getTaskDetailsById', id],
    queryFn: () => getTaskDetailsById(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  if (taskDetail) return (
    <>
      <div className="text-xl space-y-10 mt-5"> 
        <div className="shadow p-5">
          <h2 className="font-bold text-3xl text-center">
            Información de la tarea
          </h2>

          <div className="grid md:grid-cols-2 gap-2 justify-between mt-5">
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
                      Horas Rendimiento Real:{" "}
                    </span>
                    {taskDetail.real_hours}
                  </p>
                </>
              )}
              {taskDetail.passed_hours && (
                <p className="p-5 shadow bg-gray-200">
                  <span className="font-bold">
                    Horas Transcurridas Reales:{" "}
                  </span>
                  {taskDetail.passed_hours}
                </p>
              )}
              <p className="p-5 shadow bg-gray-200">
                <span className="font-bold">
                  Horas Rendimiento Teórico:{" "}
                </span>
                {taskDetail.hours}
              </p>
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

                {taskDetail.closures?.length > 0 && (
                  <table className="table mt-5">
                    <thead>
                      <tr className="thead-tr">
                        <th scope="col" className="thead-th">
                          Fecha de Cierre Parcial
                        </th>
                        <th scope="col" className="thead-th">
                          Fecha de Reapertura
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail.closures.map((closure, index) => (
                        <tr className="tbody-tr" key={index}>
                          <td className="tbody-td">{closure.start_date}</td>
                          <td className="tbody-td">{closure.end_date ?? 'SIN FECHA DE REAPERTURA'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {taskDetail.insumos && taskDetail.employees && (
          <div className="grid md:grid-cols-2">
            <div className="shadow p-5">
              <h2 className="font-bold text-3xl text-center">
                Información de insumos
              </h2>

              <div className="mt-5">
                {taskDetail.insumos.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr className="thead-tr">
                        <th scope="col" className="thead-th">
                          Insumo
                        </th>
                        <th scope="col" className="thead-th">
                          Cantidad Asignada
                        </th>
                        <th scope="col" className="thead-th">
                          Cantidad Utilizada
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail.insumos.map((insumo) => (
                        <tr className="tbody-tr" key={insumo.id}>
                          <td className="tbody-td">
                            <p>{insumo.name} </p>
                          </td>
                          <td className="tbody-td">
                            <p>
                              {insumo.assigned_quantity} {insumo.measure}
                            </p>
                          </td>
                          <td className="tbody-td">
                            <p>
                              {insumo.used_quantity} {insumo.measure}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (<p className="text-center">No cuenta con insumos asignados</p>)}

              </div>
            </div>

            {!taskDetail.use_dron ? (
              <div className="shadow p-5">
                <h2 className="font-bold text-3xl text-center">
                  Empleados Asignados
                </h2>

                <div className="mt-5">
                  <table className="table">
                    <thead>
                      <tr className="thead-tr">
                        <th scope="col" className="thead-th">
                          Codigo
                        </th>
                        <th scope="col" className="thead-th">
                          Nombre de Usuario
                        </th>
                        <th scope="col" className="thead-th">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail.employees?.map((employee) => (
                        <tr className="tbody-tr" key={employee.code}>
                          <td className="tbody-td">
                            <p>{employee.code}</p>
                          </td>
                          <td className="tbody-td">
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
            ) : (
              <div className="flex justify-center items-center flex-col">
                <DronIcon
                  width={120}
                  height={100}
                  className="bg-orange-500 w-1/6 rounded-xl text-white"
                />
                <p className="font-bold uppercase">Tarea Realizada con Dron</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
