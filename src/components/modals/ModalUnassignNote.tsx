import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { createTaskProductionUnassignment, getActiveTaskProductionEmployees } from "@/api/TaskProductionPlansAPI";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import Spinner from "../utilities-components/Spinner";

export type DraftUnassignTaskProduction = {
    reason: string;
    assignments: string[];
    employee_signature: string;
    supervisor_signature: string;
    auditor_signature: string;
    detail: number;
};

export default function ModalUnassignNote() {
    const params = useParams();
    const plan_id = params.plan_id!;
    const linea_id = params.linea_id!;
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [ids, setIds] = useState<string[]>([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('TaskId')!;
    const modal = queryParams.get('modal')!;
    const show = (taskId && +modal === 5) ? true : false;
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getTaskProductionDetails', taskId],
        queryFn: () => getActiveTaskProductionEmployees(taskId),
        enabled: !!taskId,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskProductionUnassignment,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate(location.pathname, { replace: true });
            reset();
            setIds([]);
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] });
            queryClient.invalidateQueries({ queryKey: ['getTaskProductionDetails', taskId] });
        }
    });

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<DraftUnassignTaskProduction>();

    const onSubmit = (data: DraftUnassignTaskProduction) => {
        if (ids.length === 0) {
            toast.error('Debe de seleccionar al menos una persona');
            return;
        }
        data.assignments = ids;
        mutate({ FormData: data, id: taskId })
    };

    const filteredEmployees = data?.data.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addEmployee = (id: string) => {
        if (ids.includes(id)) {
            const newIds = ids.filter(assign_id => assign_id !== id);
            setIds(newIds);
            return;
        }
        setIds((prev) => [...prev, id]);
    }

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true })
        setIds([]);
        reset();
    }

    if (data) return (
        <Modal
            modal={show}
            closeModal={() => handleCloseModal()}
            title="Nota de Deasignación de Empleados"
        >
            {isError && <ShowErrorAPI />}
            {isLoading ? (
                <div className="p-10 flex justify-center"><Spinner /></div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-6 bg-white rounded-lg shadow"
                >
                    <InputComponent<DraftUnassignTaskProduction>
                        label="Razón"
                        id="reason"
                        name="reason"
                        placeholder="Razón del retiro"
                        register={register}
                        validation={{ required: 'La razón es obligatoria' }}
                        errors={errors}
                        type="text"
                    >
                        {errors.reason && (
                            <Error>{errors.reason.message?.toString()}</Error>
                        )}
                    </InputComponent>

                    <div className="max-h-64 overflow-y-auto scrollbar-hide mt-4 rounded-lg border border-gray-200 space-y-5 p-5">
                        <input
                            type="text"
                            placeholder="Buscar empleado..."
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3">Código</th>
                                    <th className="px-4 py-3">Empleado</th>
                                    <th className="px-4 py-3">Posición</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees?.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className={`hover:bg-gray-50 transition ${(ids.includes(employee.id) ? 'bg-green-200' : '')} cursor-pointer`}
                                        onClick={() => addEmployee(employee.id)}
                                    >
                                        <td className="px-4 py-2">{employee.code}</td>
                                        <td className="px-4 py-2">{employee.name}</td>
                                        <td className="px-4 py-2">{employee.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {isPending ? <Spinner /> : <p>Guardar Información</p>}
                    </button>
                </form>
            )}
        </Modal>
    );
}
