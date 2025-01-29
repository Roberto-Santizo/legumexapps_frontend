import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { useParams } from "react-router-dom";
import { TaskCropWeeklyPlanDetail } from "../../../types";
import Spinner from "../../../components/Spinner";
import { formatDate } from "../../../helpers";

export default function ResumenTareaCosechaLote() {
  const { task_crop_id } = useParams();
  const getTaskCropDetails = useAppStore((state) => state.getTaskCropDetails);
  const loadingGetTask = useAppStore((state) => state.loadingGetTask);
  const [taskCropDetail, setTaskCropDetail] =
    useState<TaskCropWeeklyPlanDetail>();

  const fetchTaskCropDetails = async () => {
    if (task_crop_id) {
      const details = await getTaskCropDetails(task_crop_id);
      setTaskCropDetail(details);
    }
  };

  useEffect(() => {
    fetchTaskCropDetails();
  }, []);

  return (
    <>
      {loadingGetTask && <Spinner />}
      {!loadingGetTask && taskCropDetail && (
        <div className="space-y-10 mb-10">
          <div>
            <h2 className="font-bold text-3xl">Resumen de Cosecha</h2>
          </div>

          <div className="text-xl shadow p-5 space-y-5">
            <h2 className="font-bold text-3xl">Información General</h2>
            <div className="grid grid-cols-4">
              <p>
                <span className="font-bold">Lote:</span> {taskCropDetail.lote}
              </p>
              <p>
                <span className="font-bold">Finca:</span> {taskCropDetail.finca}
              </p>
              <p>
                <span className="font-bold">CDP: </span>
                {taskCropDetail.cdp}
              </p>
              <p>
                <span className="font-bold">
                  Semana<span className="text-xs">(calendario)</span>:
                </span>{" "}
                {taskCropDetail.week}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto space-y-5">
            <h2 className="text-xl font-bold uppercase">
              Resumen Cosecha Total
            </h2>
            <table className="table">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Fecha</th>
                  <th className="thead-th">Total Libras Finca</th>
                  <th className="thead-th">Total Libras Planta</th>
                  <th className="thead-th">Total Plantas Cosechadas</th>
                  <th className="thead-th">Hora de Inicio</th>
                  <th className="thead-th">Hora de Cierre</th>
                </tr>
              </thead>
              <tbody>
                {taskCropDetail?.assigments.map((assignment) => (
                  <tr key={assignment.id} className="tbody-tr">
                    <td className="tbody-td">{formatDate(assignment.date)}</td>
                    <td className="tbody-td">{assignment.lbs_finca} LBS</td>
                    <td className="tbody-td">{assignment.lbs_planta} LBS</td>
                    <td className="tbody-td">{assignment.plants} Plantas</td>
                    <td className="tbody-td">{assignment.start_hour}</td>
                    <td className="tbody-td">{assignment.end_hour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto space-y-5">
            <h2 className="text-xl font-bold uppercase">
              Resumen Cosecha Por Empleado
            </h2>
            <table className="table">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">CODIGO</th>
                  <th className="thead-th">EMPLEADO</th>
                  <th className="thead-th">FECHA</th>
                  <th className="thead-th">TOTAL LIBRAS FINCA</th>
                </tr>
              </thead>
              <tbody>
                {taskCropDetail?.employees.map((employee) => (
                  <tr key={employee.id} className="tbody-tr">
                    <td className="tbody-td">{employee.code}</td>
                    <td className="tbody-td">{employee.name}</td>
                    <td className="tbody-td">{formatDate(employee.date)}</td>
                    <td className="tbody-td">{employee.lbs} LBS</td>
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
