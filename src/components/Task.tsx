import { TaskWeeklyPlan } from "../types"

type TaskProps = {
    task: TaskWeeklyPlan
}

export default function Task({task} : TaskProps) {
  return (
    <div className="shadow-xl p-10 text-xl">
        <p><span className="font-bold uppercase">ID: </span>{task.id}</p>
        <p><span className="font-bold uppercase">Semana: </span>{task.week}</p>
        <p><span className="font-bold uppercase">Tarea: </span>{task.task}</p>
        <p><span className="font-bold uppercase">Presupuesto: </span>{task.budget}</p>
        <p><span className="font-bold uppercase">Fecha de Asignación: </span>{task.start_date ?? 'Sin asignación' }</p>
        <p><span className="font-bold uppercase">Fecha de Cierre: </span>{task.end_date ?? 'Sin cierre' }</p>
    </div>
  )
}
