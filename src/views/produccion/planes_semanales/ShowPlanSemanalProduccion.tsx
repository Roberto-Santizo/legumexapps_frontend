import { useParams } from "react-router-dom";
import TaskLabel from "../../../components/TaskLabel";
import {
  CircleCheck,
  CirclePause,
  PlayCircleIcon,
} from "lucide-react";

export default function ShowPlanSemanalProduccion() {
  const params = useParams();

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
    <div className="col-span-5">
      <TaskLabel label={"ID"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Linea"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Total de tarimas"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Dia de operacion"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Fecha de inicio"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Fecha de Asignacion"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Fecha de cierre"} text={"Insertar dato aca"}/>
      <TaskLabel label={"Horas totales"} text={"Insertar dato aca"}/>
    </div>

    <div className="col-start-7 space-y-5">
      <div className="flex flex-col justify-center items-center gap-4">
        <PlayCircleIcon className="cursor-pointer text-green-500 hover:text-green-400" /> 
        <CircleCheck className="cursor-pointer hover:text-green-400" />
        <CirclePause className="cursor-pointer text-orange-500 hover:text-orange-800" />
      </div>
    </div>
  </div>
  )
}







