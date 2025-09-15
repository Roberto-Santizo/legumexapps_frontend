import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Employee } from "@/types";
import { Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";
import { closeAssigment, getEmployees, getTask } from "@/api/TasksWeeklyPlanAPI";
import { useMutation, useQueries } from "@tanstack/react-query";
import { TaskWeeklyPlan } from "types/taskWeeklyPlanTypes";
import Swal from "sweetalert2";
import Fuse from "fuse.js";
import Spinner from "@/components/utilities-components/Spinner";
import Worker from "@/components/tareas-lote-plan/Worker";

export default function Assign() {
  const params = useParams();
  const finca_id = params.finca_id!!;
  const task_id = params.task_id!!;
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";

  const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState<string>("");
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [results, setResults] = useState<Employee[]>(employees);
  const isTaskInitialized = useRef(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: closeAssigment,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate(previousUrl);
    },
  });

  const resultsQuery = useQueries({
    queries: [
      { queryKey: ['getTask', task_id], queryFn: () => getTask(task_id) },
      { queryKey: ['getEmployees', finca_id], queryFn: () => getEmployees(finca_id) }
    ]
  });

  useEffect(() => {
    if (resultsQuery[0].data && !isTaskInitialized.current) {
      setTask(resultsQuery[0].data);
      isTaskInitialized.current = true;
    }
    if (resultsQuery[1].data) {
      setEmployees(resultsQuery[1].data);
    }
  }, [resultsQuery]);


  const isLoading = resultsQuery.some(result => result.isLoading);

  const necesarySlots = useMemo(() => {
    return assignedEmployees.length >= task.minimum_slots;
  }, [assignedEmployees, task.minimum_slots]);

  const fuse = new Fuse(employees, {
    keys: ["name"],
    threshold: 0.4,
  });

  const isValidTask = () => {
    if (task.start_date != null) {
      return true;
    }

    return false;
  };

  const reduceSlots = (task: TaskWeeklyPlan) => {
    const updatedTask = { ...task, slots: task.slots - 1 };
    setTask(updatedTask);
  };

  const addSlots = (task: TaskWeeklyPlan) => {
    const updatedTask = { ...task, slots: task.slots + 1 };
    setTask(updatedTask);
  };

  useEffect(() => {
    setResults(employees);
  }, [employees]);

  const uniqueEmployees = useMemo(() => {
    return [...new Map(results.map(e => [e.emp_id, e])).values()];
  }, [results]);


  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    const result = input
      ? fuse.search(input).map((res) => res.item)
      : employees;
    setResults(result);
  };

  const handleAddEmployee = (employee: Employee) => {
    if (task.slots === 0) {
      toast.error("No puedes asignar más empleados a esta tarea");
      return;
    }

    setAssignedEmployees((prev) => [...prev, employee]);
    reduceSlots(task);
  };

  const handleRemoveEmployee = (employee: Employee) => {
    if (assignedEmployees.some((emp) => emp.emp_id === employee.emp_id)) {
      setAssignedEmployees(
        assignedEmployees.filter((emp) => emp.emp_id !== employee.emp_id)
      );
      addSlots(task);
    }
  };

  const handleCloseAssignment = () => {
    if (assignedEmployees.length === 0) {
      toast.error("No hay empleados asignados a la tarea");
      return;
    }
    if (!necesarySlots) {
      Swal.fire({
        title: "¿Deseas Cerrar la Asignación?",
        text: `Los cupos minimos son: ${task.minimum_slots} y solo hay ${assignedEmployees.length} empleados asignados`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Cerrar Asignación",
      }).then((result) => {
        if (result.isConfirmed) {
          mutate({ Employees: assignedEmployees, task_id: task.id });
        }
      });
      return;
    }
    mutate({ Employees: assignedEmployees, task_id: task.id });
  };

  useEffect(() => {
    if (isValidTask()) {
      navigate("/planes-semanales");
      toast.error("La tarea ya cuenta con asignación");
    }
  }, []);

  if (isLoading) return <Spinner />
  if (task && task.insumos) return (
    <>
      <h1 className="text-4xl font-bold text-center mb-8">
        Asignación de Empleados
      </h1>

      <div className="grid md:grid-cols-6 gap-8">
        <div className="md:col-span-4 space-y-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-black uppercase mb-4">
              Información de la Tarea
            </h2>
            <p><span className="font-semibold">Cupos Disponibles:</span> {task.slots}</p>
            <p><span className="font-semibold">Tarea:</span> {task.task}</p>
            <p><span className="font-semibold">Finca:</span> {task.lote}</p>
            <p><span className="font-semibold">Semana:</span> {task.week}</p>
            <p><span className="font-semibold">Cupos Mínimos:</span> {task.minimum_slots}</p>

            {task.insumos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">Insumos Asignados</h3>
                <table className="w-full text-left border-t border-gray-200">
                  <thead className="bg-gray-100 text-sm font-semibold">
                    <tr>
                      <th className="py-2 px-4">Insumo</th>
                      <th className="py-2 px-4">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.insumos.map(insumo => (
                      <tr key={insumo.id} className="border-t">
                        <td className="py-2 px-4">{insumo.name}</td>
                        <td className="py-2 px-4">{insumo.assigned_quantity} {insumo.measure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-black uppercase mb-4">Empleados Asignados</h2>
            <div className="h-96 overflow-y-auto space-y-2">
              {assignedEmployees.length === 0 ? (
                <p className="text-gray-500 text-center">No hay empleados asignados</p>
              ) : (
                assignedEmployees.map((employee) => (
                  <div
                    key={employee.emp_id}
                    className="flex justify-between items-center bg-indigo-100 text-indigo-800 font-medium px-4 py-2 rounded-md shadow-sm"
                  >
                    <span>{employee.name}</span>
                    <Trash2Icon
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveEmployee(employee)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6 overflow-y-auto h-full flex flex-col scrollbar-hide">
            <h2 className="text-2xl font-bold text-black text-center mb-4">
              Empleados Disponibles
            </h2>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Buscar empleado..."
              className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex-1 overflow-y-auto space-y-2  max-h-screen scrollbar-hide">
              {results.length === 0 ? (
                <p className="text-gray-500 text-center">No hay resultados</p>
              ) : (
                uniqueEmployees.map((employee) => (
                  <Worker
                    key={employee.emp_id}
                    employee={employee}
                    handleAddEmployee={handleAddEmployee}
                    assignedEmployees={assignedEmployees}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center my-5 w-full">
        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full" onClick={() => handleCloseAssignment()}>
          {isPending ? <Spinner /> : <p>Cerrar Asignación</p>}
        </button>
      </div>
    </>
  );

}
