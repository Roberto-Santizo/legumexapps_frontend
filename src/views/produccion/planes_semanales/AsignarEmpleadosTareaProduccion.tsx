import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { EmployeeProduction, getTaskProductionDetails, startTaskProduction, TaskProductionDetails } from "@/api/WeeklyProductionPlanAPI";
import { getComodines } from "@/api/WeeklyProductionPlanAPI";
import { formatDate } from "@/helpers";
import { DndContext, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import ColumnContainer from "@/components/ColumnContainer";
import EmployeeDraggable from "@/components/EmployeeDraggable";
import ModalChangeEmployee from "@/components/ModalChangeEmployee";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export type Column = {
    id: string,
    title: string
}

const initialValues = [
    { id: '1', title: 'fijos' },
    { id: '2', title: 'comodines' },
]

export default function ShowTaskProductionDetails() {
    const params = useParams();
    const task_p_id = params.task_p_id!!;
    const [columns] = useState<Column[]>(initialValues);
    const [modal, setModal] = useState<boolean>(false);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeEmployee, setActiveEmployee] = useState<EmployeeProduction | null>(null);
    const [taskData, setTaskData] = useState<TaskProductionDetails>();
    const [employees, setEmployees] = useState<EmployeeProduction[]>([]);
    const [availableEmployees, setAvailableEmployees] = useState<EmployeeProduction[]>([]);
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: startTaskProduction,
        onError: () => {
            toast.error('Error al cerrar la asignación');
        },
        onSuccess: () => {
            toast.success('Tarea Iniciada Correctamente');
            navigate('/planes-produccion');
        }
    });

    const columnsId = useMemo(() => {
        return columns.map(column => column.id)
    }, [columns]);

    const results = useQueries({
        queries: [
            { queryKey: ['getTaskProductionDetails', task_p_id], queryFn: () => getTaskProductionDetails(task_p_id) },
            { queryKey: ['getComodines'], queryFn: getComodines },
        ]
    });

    useEffect(() => {
        if (results[0]?.data || results[1]?.data) {
            setTaskData(results[0]?.data);
            const employeesFromTask = results[0]?.data?.employees ?? [];
            const employeesFromComodines = results[1]?.data ?? [];

            const uniqueEmployees = [...new Map([...employeesFromTask, ...employeesFromComodines].map(emp => [emp.id, emp])).values()];

            setEmployees(uniqueEmployees);
            setAvailableEmployees(uniqueEmployees.filter(employee => employee.column_id === '1'));
        }
    }, [results[0]?.data, results[1]?.data]);



    const onDragEnd = (event: DragOverEvent) => {
        setActiveColumn(null);
        setActiveEmployee(null);

        const { active, over } = event;

        if (!over || !active) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveEmployee = active.data.current?.type === "Employee";
        const isOverEmployee = over.data.current?.type === "Employee";

        if (isOverEmployee && isActiveEmployee) {
            const active = employees.filter(emp => emp.id === activeId);
            const over = employees.filter(emp => emp.id === overId);

            if (active[0].column_id !== over[0].column_id) {
                const activeIndex = employees.findIndex(emp => emp.id === activeId);
                setActiveEmployee(employees[activeIndex]);
                setModal(true);
            };
            const newEmployees = () => {
                const activeIndex = employees.findIndex(emp => emp.id === activeId);
                const overIndex = employees.findIndex(emp => emp.id === overId);
                return arrayMove(employees, activeIndex, overIndex);
            }
            const updatedEmployees = newEmployees();
            setEmployees(updatedEmployees);
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveEmployee && isOverAColumn) {
            const activeIndex = employees.findIndex(emp => emp.id === activeId);
            setActiveEmployee(employees[activeIndex]);
            setModal(true);
        }
    };

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
        }

        if (event.active.data.current?.type === "Employee") {
            setActiveEmployee(event.active.data.current.employee);
        }
    }

    const handleStartTask = () => {
        Swal.fire({
            title: "¿Desea iniciar la tarea?",
            text: "Una vez iniciada no podra modificar la asignación",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, cerrar asignación",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(task_p_id);
            }
        });
    }

    const isLoading = results.some(result => result.isLoading);
    if (isLoading) return <Spinner />

    return (
        <div className="space-y-10 mb-10">
            <h1 className="font-bold text-4xl">Información</h1>
            <div className="p-5 shadow-xl">
                <div className="font-bold">Línea: <span className="font-normal ml-2">{taskData?.line ?? 'N/A'}</span></div>
                <div className="font-bold">Fecha de operación:<span className="font-normal ml-2">{taskData?.operation_date ? formatDate(taskData.operation_date) : 'N/A'}</span></div>
                <div className="font-bold">Total de tarimas:<span className="font-normal ml-2">{taskData?.total_tarimas ?? 0}</span></div>
                <div className="font-bold">SKU:<span className="font-normal ml-2">{taskData?.sku?.code ?? 'N/A'}</span></div>
                <div className="font-bold">Descripción:<span className="font-normal ml-2">{taskData?.sku?.product ?? 'N/A'}</span></div>
                <div className="font-bold">Empleados asignados:<span className="font-normal ml-2">{taskData?.employees?.length ?? 0}</span></div>
            </div>

            <div className="flex justify-between w-full mx-auto gap-5">
                <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} >
                    <SortableContext items={columnsId}>
                        {columns.map(column => (
                            <ColumnContainer key={column.id} column={column} employees={employees.filter(employee => employee.column_id === column.id)} />
                        ))}
                    </SortableContext>

                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer column={activeColumn} employees={employees.filter(employee => employee.column_id === activeColumn.id)} />
                            )}

                            {activeEmployee && (
                                <EmployeeDraggable employee={activeEmployee} />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>

            {(modal && activeEmployee) && (
                <ModalChangeEmployee modal={modal} setModal={setModal} employee={activeEmployee} availableEmployees={availableEmployees} setEmployees={setEmployees} />
            )}

           <button onClick={() => handleStartTask()} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                {isPending ? <Spinner /> : <p>Cerrar Asignación</p>}
           </button>
        </div>
    );
}

