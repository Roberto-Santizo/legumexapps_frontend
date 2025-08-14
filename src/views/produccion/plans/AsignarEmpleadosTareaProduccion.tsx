import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Apple, ArrowBigRight, BookCheck, Calendar, ChartLine, Info, TrashIcon, UsersIcon } from "lucide-react";
import { confirmAssignment, createTaskProductionEmployees, getComodines, getTaskProductionDetails } from "@/api/TaskProductionPlansAPI";
import { DraftTaskProductionEmployee, TaskProductionChange, TaskProductionEmployee } from "types/taskProductionPlanTypes";
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import ModalChangeEmployee from "@/components/modals/ModalChangeEmployee";
import Swal from "sweetalert2";
import TaskProductionAsignacionSkeleton from "@/components/produccion/TaskProductionAsignacionSkeleton";
import CardInfo from "@/components/shared/CardInfo";
import TableEmployees from "@/components/produccion/TableEmployees";


export default function ShowTaskProductionDetails() {
    const params = useParams();
    const task_p_id = params.task_p_id!!;
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;
    const queryClient = useQueryClient();

    const location = useLocation();
    const url = location.state?.url ?? '/planes-produccion';

    const [modal, setModal] = useState<boolean>(false);
    const [selectedComodin, setSelectedComodin] = useState<TaskProductionEmployee>({} as TaskProductionEmployee);
    const [changes, setChanges] = useState<TaskProductionChange[]>([]);
    const [newEmployees, setNewEmployees] = useState<DraftTaskProductionEmployee[]>([]);
    const [availableEmployees, setAvailableEmployees] = useState<TaskProductionEmployee[]>([]);
    const [comodines, setComodines] = useState<TaskProductionEmployee[]>([]);
    const [counter, setCounter] = useState<number>(0);
    const navigate = useNavigate();

    const { data: taskDetails, isLoading, isError } = useQuery({
        queryKey: ['getTaskProductionDetails', task_p_id],
        queryFn: () => getTaskProductionDetails(task_p_id),
        refetchOnWindowFocus: false,
        retry: false
    });

    const validated_employees = useMemo(() => taskDetails?.employees.filter(employee => employee.flag).length, [taskDetails?.employees]);

    const { data: comodinesData, isLoading: isLoadingComodines, isError: isErrorComodines } = useQuery({
        queryKey: ['getComodines'],
        queryFn: getComodines,
        refetchOnWindowFocus: false,
        retry: false
    });

    const handleChangeEmployee = (comodin: TaskProductionEmployee) => {
        setSelectedComodin(comodin);
        setModal(true);

    }

    const handleDeleteEmployee = (index: number) => {
        const old_employee = changes.filter((_, i) => i === index)[0].old_employee;
        const new_employee = changes.filter((_, i) => i === index)[0].new_employee;
        const newChanges = changes.filter((_, i) => i !== index);
        setChanges(newChanges);
        setAvailableEmployees((prev) => [...prev, old_employee]);
        setComodines((prev) => [...prev, new_employee]);
        setCounter(counter - 1);
    }

    const handleDeleteNewEmployee = (index: number) => {
        const employeeToRemove = newEmployees[index];

        const newEmployeesAux = newEmployees.filter(emp => emp.code !== employeeToRemove.code);
        const comodin = comodinesData?.find(c => c.code === employeeToRemove.code);

        if (comodin) {
            setComodines(prev => [...prev, comodin]);
            setNewEmployees(newEmployeesAux);
        }
    };


    useEffect(() => {
        if (taskDetails) {
            setAvailableEmployees(taskDetails.employees.filter(employee => !employee.flag));
        }
    }, [taskDetails]);

    useEffect(() => {
        if (comodinesData) {
            setComodines(comodinesData);
        }
    }, [comodinesData]);


    const { mutate: firstMutation, isPending } = useMutation({
        mutationFn: confirmAssignment,
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { mutate: secondMutation, isPending: isPendingNewEmployees } = useMutation({
        mutationFn: createTaskProductionEmployees,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Asignación y empleados confirmados");
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] });
            navigate(url);
        }
    });

    const loading = useMemo(() => {
        return isPending || isPendingNewEmployees;
    }, [isPending, isPendingNewEmployees]);

    const handleUsePreviousConfig = () => {
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Los cambios se confirmarán y se utilizará la configuración de empleados de la tarea anterior",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmar asignación",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.allSettled([firstMutation({ changes, id: task_p_id, previousConfig: true }), secondMutation({ id: task_p_id, FormData: newEmployees })]);
                } catch (error) {
                    toast.error("Hubo un error en el proceso");
                }
            }
        });
    }

    const handleConfirmAssignment = () => {
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Una vez cerrada la asignación no sé podrán los revertir los cambios",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmar asignación",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.allSettled([firstMutation({ changes, id: task_p_id, previousConfig: false }), secondMutation({ id: task_p_id, FormData: newEmployees })]);
                } catch (error) {
                    toast.error("Hubo un error en el proceso");
                }
            }
        });
    }

    const handleSelectOption = (comodin: TaskProductionEmployee) => {
        Swal.fire({
            title: `¿Qué desea hacer con ${comodin.name}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Cambiar Empleado",
            denyButtonText: `Agregar Empleado`,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleChangeEmployee(comodin);
            } else if (result.isDenied) {

                const data: DraftTaskProductionEmployee = {
                    name: comodin.name,
                    code: comodin.code,
                    position_id: '',
                    new_position: comodin.position,
                    old_position: comodin.position
                }

                setComodines(prev => prev.filter(employee => employee.code !== comodin.code));
                setNewEmployees(prev => [...prev, data]);
            }
        });
    }


    if (isLoading || isLoadingComodines) return <TaskProductionAsignacionSkeleton />;
    if (isError || isErrorComodines) return <Spinner />;
    if (taskDetails && comodines) return (
        <>
            <h1 className="font-bold text-4xl text-gray-800 tracking-tight">
                Información y Asignaciones
            </h1>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <CardInfo label="Línea" text={taskDetails.line} child={<BookCheck className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="Fecha de operación" text={formatDate(taskDetails.operation_date)} child={<Calendar className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="Libras Programadas" text={`${taskDetails.total_lbs} lbs`} child={<ChartLine className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="SKU" text={taskDetails.sku.code} child={<Info className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="Producto" text={taskDetails.sku.product_name} child={<Apple className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="Total Empleados Validados" text={`${validated_employees} / ${taskDetails.employees.length}`} child={<UsersIcon className="h-10 w-10 text-blue-600" />} />
                <CardInfo label="Total Comodines Asignados" text={`${newEmployees.length + counter}`} child={<UsersIcon className="h-10 w-10 text-blue-600" />} />
            </div>

            <section className="mt-10 flex flex-col lg:flex-row gap-8">
                <TableEmployees employees={taskDetails.employees} onClick={() => { }} />
                <TableEmployees employees={comodines} onClick={handleSelectOption} />
            </section>

            <div className="shadow-lg rounded-xl overflow-hidden mt-8 border border-gray-200">
                <p className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 py-2 text-white font-semibold">
                    Resumen de Cambios
                </p>

                <div className="max-h-96 overflow-y-auto scrollbar-hide divide-y divide-gray-100">
                    {(changes.length === 0 && newEmployees.length === 0) && (
                        <p className="text-center text-lg text-gray-500 py-8">No existen cambios</p>
                    )}

                    <AnimatePresence>
                        {changes.map((change, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between bg-white px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-xs text-gray-500">Nuevo</span>
                                        <p className="text-base font-semibold text-indigo-600">
                                            {change.new_employee.name} ({change.new_employee.position})
                                        </p>
                                    </div>

                                    <ArrowBigRight className="w-6 h-6 text-gray-400" />

                                    <div>
                                        <span className="text-xs text-gray-500">Anterior</span>
                                        <p className="text-base font-semibold text-purple-600">
                                            {change.old_employee.name} ({change.old_employee.position})
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200 group"
                                    title="Eliminar cambio"
                                    onClick={() => handleDeleteEmployee(index)}
                                >
                                    <TrashIcon className="w-5 h-5 text-red-500 group-hover:text-red-700" />
                                </button>
                            </motion.div>
                        ))}

                        {newEmployees.map((newEmployee, index) => (
                            <motion.div
                                key={newEmployee.code}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-between bg-white px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-xs text-gray-500">Empleado</span>
                                        <p className="text-base font-semibold text-indigo-600">
                                            {newEmployee.name} ({newEmployee.old_position})
                                        </p>
                                    </div>

                                    <ArrowBigRight className="w-6 h-6 text-gray-400" />

                                    <div>
                                        <span className="text-xs text-gray-500">Posición</span>
                                        <p className="text-base font-semibold text-purple-600">
                                            {newEmployee.new_position}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200 group"
                                    title="Eliminar cambio"
                                    onClick={() => handleDeleteNewEmployee(index)}
                                >
                                    <TrashIcon className="w-5 h-5 text-red-500 group-hover:text-red-700" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className=" flex flex-row items-center justify-center gap-5 mt-10">
                <button onClick={() => handleConfirmAssignment()} disabled={loading} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {loading ? <Spinner /> : <p>Confirmar Asignaciones</p>}
                </button>

                <button disabled={!taskDetails.exists_previuos_config} className={`${taskDetails.exists_previuos_config ? 'bg-red-500 hover:bg-red-600 cursor-pointer' : 'bg-red-500/40 cursor-not-allowed'} button w-full`} onClick={() => handleUsePreviousConfig()}>
                    Utilizar configuración anterior
                </button>
            </div>

            {/* Modal */}
            {modal && (
                <ModalChangeEmployee
                    modal={modal}
                    setModal={setModal}
                    availableEmployees={availableEmployees}
                    setAvailableEmployees={setAvailableEmployees}
                    selectedComodin={selectedComodin}
                    setSelectedComodin={setSelectedComodin}
                    setChanges={setChanges}
                    setComodines={setComodines}
                    setCounter={setCounter}
                    counter={counter}
                />
            )}
        </>

    );
}

