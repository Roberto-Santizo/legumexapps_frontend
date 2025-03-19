import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { Column } from "views/produccion/planes_semanales/AsignarEmpleadosTareaProduccion"
import { CSS } from "@dnd-kit/utilities";
import { EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import EmployeeDraggable from "./EmployeeDraggable";
import { useMemo } from "react";

type Props = {
    column: Column,
    employees: EmployeeProduction[]
}

export default function ColumnContainer({ column, employees }: Props) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        }
    })

    const EmployeesIds = useMemo(()=>{
        return employees.map(employee => employee.id)
    },[employees]);

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div key={column.id} ref={setNodeRef} style={style} className="w-full text-center h-96 shadow-xl">
            </div>
        )
    }

    return (
        <div ref={setNodeRef} style={style} className="w-full text-center shadow-xl">
            <p {...attributes} {...listeners} className="bg-blue-300 text-white uppercase font-bold p-2 rounded">{column.title}</p>
            <div className="flex flex-col gap-5 mt-1 h-96 overflow-y-auto scrollbar-hide p-5">
                <SortableContext items={EmployeesIds}>
                    {employees.map(employee => (
                        <EmployeeDraggable key={employee.position} employee={employee} />
                    ))}
                </SortableContext>
            </div>
        </div>
    )
}
