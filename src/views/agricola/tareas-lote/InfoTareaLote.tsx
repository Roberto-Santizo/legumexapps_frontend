import {  useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { TaskWeeklyPlanDetails } from "../../../types";
import Spinner from "../../../components/Spinner";
import { Trash } from "lucide-react";

export default function InfoTareaLote() {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);

  const getTaskDetailsById = useAppStore((state) => state.getTaskDetailsById);

  const [taskDetail, setTaskDetail] = useState<TaskWeeklyPlanDetails>(
    {} as TaskWeeklyPlanDetails
  );

  const handleGetTaskDetail = async () => {
    setLoading(true);

    try {
      if(id){
        const taskDetails = await getTaskDetailsById(id);
        setTaskDetail(taskDetails);
      }
    } catch (error) {
      setError(true);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetTaskDetail()
  }, []);

  return (
    <>
      {loading && <Spinner />}
      {!loading && !error && (
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
                        {taskDetail.closures.map((closure,index) => (
                          <tr className="tbody-tr" key={index}>
                            <td className="tbody-td">{closure.start_date}</td>
                            <td className="tbody-td">{closure.end_date}</td>
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
        </div>
      )}
    </>
  );
}
