import { CircleCheck, Clock } from "lucide-react";
import TaskLabel from "./TaskLabel";
import { TaskByDate } from "@/api/WeeklyProductionPlanAPI";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    task: TaskByDate;
}

export default function TaskProductionComponent({ task }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.priority,
        data: {
            type: "Task",
            task
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div key={task.id} ref={setNodeRef} style={style} {...attributes} {...listeners} className="grid grid-cols-6 shadow-xl p-10 text-xl bg-white">
                <div className="col-span-5 grid grid-cols-12">
                    <div className="col-start-1 col-span-1">

                        {task.end_date ? (
                            <CircleCheck className="w-6 text-green-500" />
                        ) : (
                            <Clock className="w-6 text-orange-500" />
                        )}
                    </div>
                    <div className="col-start-2 col-span-11">
                        <TaskLabel label={"ID"} text={task.id} />
                        <TaskLabel label={"SKU"} text={task.sku} />
                        <TaskLabel label={"Linea"} text={task.line} />
                        <TaskLabel label={"Total de Tarimas"} text={task.total_tarimas.toString()} />
                        <TaskLabel label={"Fecha de Operación"} text={task.operation_date} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-6 shadow-xl p-10 text-xl" ref={setNodeRef} key={task.id} style={style}  {...attributes} {...listeners}>
            <div className="col-span-5 grid grid-cols-12">
                <div className="col-start-1 col-span-1">

                    {task.end_date ? (
                        <CircleCheck className="w-6 text-green-500" />
                    ) : (
                        <Clock className="w-6 text-orange-500" />
                    )}
                </div>
                <div className="col-start-2 col-span-11">
                    <TaskLabel label={"ID"} text={task.id} />
                    <TaskLabel label={"SKU"} text={task.sku} />
                    <TaskLabel label={"Linea"} text={task.line} />
                    <TaskLabel label={"Total de Tarimas"} text={task.total_tarimas.toString()} />
                    <TaskLabel label={"Fecha de Operación"} text={task.operation_date} />
                </div>
            </div>
        </div>
    )
}
