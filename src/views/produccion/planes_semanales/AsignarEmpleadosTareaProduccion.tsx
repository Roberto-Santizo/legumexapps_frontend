import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowBigRight, PlusIcon, TrashIcon, User } from "lucide-react";
import { confirmAssignment, createTaskProductionEmployees, getComodines, getTaskProductionDetails } from "@/api/TaskProductionPlansAPI";
import { DraftTaskProductionEmployee, TaskProductionChange, TaskProductionEmployee } from "types/taskProductionPlanTypes";
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Position } from "@/api/LineasAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ModalChangeEmployee from "@/components/modals/ModalChangeEmployee";
import Swal from "sweetalert2";
import ModalAddEmployee from "@/components/modals/ModalAddEmployee";


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
    const [positions, setPositions] = useState<Position[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const { data: taskDetails, isLoading, isError } = useQuery({
        queryKey: ['getTaskProductionDetails', task_p_id],
        queryFn: () => getTaskProductionDetails(task_p_id),
        refetchOnWindowFocus: false,
        retry: false
    });

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
    }

    const handleDeleteNewEmployee = (index: number) => {
        const employeeToRemove = newEmployees[index];

        const newEmployeesAux = newEmployees.filter(emp => emp.code !== employeeToRemove.code);
        const comodin = comodinesData?.find(c => c.code === employeeToRemove.code);
        const position = taskDetails?.positions.find(p => p.id === employeeToRemove.position_id);

        if (comodin && position) {
            setComodines(prev => [...prev, comodin]);
            setPositions(prev => [...prev, position]);
            setNewEmployees(newEmployeesAux);
        }
    };


    useEffect(() => {
        if (taskDetails) {
            setAvailableEmployees(taskDetails.filtered_employees);
            setPositions(taskDetails.positions);
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
                    await Promise.allSettled([firstMutation({ changes, id: task_p_id }), secondMutation({ id: task_p_id, FormData: newEmployees })]);
                } catch (error) {
                    toast.error("Hubo un error en el proceso");
                }
            }
        });
    }

    if (isLoading || isLoadingComodines) return <Spinner />;
    if (isError || isErrorComodines) return <Spinner />;
    if (taskDetails && comodines) return (
        <div className="space-y-10 mb-10">
            <h1 className="font-bold text-4xl">Información</h1>
            <div className="p-5 shadow-xl grid grid-cols-2">
                <div>
                    <div className="font-bold">Línea: <span className="font-normal ml-2">{taskDetails.line ?? 'N/A'}</span></div>
                    <div className="font-bold">Fecha de operación:<span className="font-normal ml-2">{taskDetails.operation_date ? formatDate(taskDetails.operation_date) : 'N/A'}</span></div>
                    <div className="font-bold">Total de libras:<span className="font-normal ml-2">{taskDetails.total_lbs ?? 0}</span></div>
                    <div className="font-bold">SKU:<span className="font-normal ml-2">{taskDetails.sku.code ?? 'N/A'}</span></div>
                    <div className="font-bold">Descripción:<span className="font-normal ml-2">{taskDetails.sku.product_name ?? 'N/A'}</span></div>
                </div>
                <div>
                    {taskDetails?.flag && (
                        <button onClick={() => setIsOpen(true)} className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2" >
                            <PlusIcon />
                            <p>Agregar Empleado</p>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div>
                    <p className="text-center bg-indigo-500 p-1 text-white font-bold">Comodines Disponibles</p>
                    <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-2">
                        {comodines?.map(comodin => (
                            <div key={comodin.position} className="flex justify-between items-center gap-3 px-5 py-3 rounded-lg shadow-md border border-gray-300 bg-white text-gray-700 font-medium transition-all cursor-pointer hover:bg-gray-100"
                                onClick={() => handleChangeEmployee(comodin)}
                            >
                                <div className='flex items-center gap-3'>
                                    <div className="bg-indigo-500 text-white p-2 rounded-full">
                                        <User size={18} />
                                    </div>
                                    <p className="text-sm">{comodin.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="shadow">
                    <p className="text-center bg-indigo-500 p-1 text-white font-bold">Resumen de Cambios</p>

                    <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-2">
                        {(changes.length === 0 && newEmployees.length === 0) && <p className="text-center text-lg mt-10">No existen cambios</p>}
                        <AnimatePresence>
                            {changes.map((change, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-gray-500">Nuevo</span>
                                            <p className="text-base font-semibold text-indigo-600">{change.new_employee.name} ({change.new_employee.position})</p>
                                        </div>

                                        <ArrowBigRight className="w-6 h-6 text-gray-400" />

                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-gray-500">Anterior</span>
                                            <p className="text-base font-semibold text-purple-600">{change.old_employee.name} ({change.old_employee.position})</p>
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
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-gray-500">Empleado</span>
                                            <p className="text-base font-semibold text-indigo-600">{newEmployee.name} ({newEmployee.old_position})</p>
                                        </div>

                                        <ArrowBigRight className="w-6 h-6 text-gray-400" />

                                        <div className="flex flex-col items-start">
                                            <span className="text-xs text-gray-500">Posición</span>
                                            <p className="text-base font-semibold text-purple-600">{newEmployee.new_position}</p>
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
            </div>

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
                />
            )}

            <ModalAddEmployee
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                comodines={comodines}
                setComodines={setComodines}
                positions={positions}
                setPositions={setPositions}
                setNewEmployees={setNewEmployees}
            />

            <button onClick={() => handleConfirmAssignment()} disabled={loading} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                {loading ? <Spinner /> : <p>Confirmar Asignaciones</p>}
            </button>
        </div>
    );
}

