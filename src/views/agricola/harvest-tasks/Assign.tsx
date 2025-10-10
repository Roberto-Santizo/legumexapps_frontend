import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { Employee, TaskCropWeeklyPlan } from "@/types/index";
import { Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";
import { getEmployees } from "@/api/TasksWeeklyPlanAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { closeCropAssigment, getTaskCrop } from "@/api/TaskCropWeeklyPlanAPI";
import Spinner from "@/components/utilities-components/Spinner";
import TaskLabel from "@/components/utilities-components/TaskLabel";
import Fuse from "fuse.js";
import Worker from "@/components/tareas-lote-plan/Worker";

export default function Assign() {
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";
  const params = useParams();
  const task_crop_id = params.task_crop_id!!;
  const finca_id = params.finca_id!!;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taskCrop, setTaskCrop] = useState<TaskCropWeeklyPlan>({} as TaskCropWeeklyPlan);

  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState<string>("");

  const [results, setResults] = useState<Employee[]>(employees);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ assignedEmployees, id }: { assignedEmployees: Employee[], id: TaskCropWeeklyPlan['id'] }) => closeCropAssigment(assignedEmployees, id),
    onError: () => {
      toast.error("Hubo un error al cerrar la asignación");
    },
    onSuccess: () => {
      toast.success("Asignación cerrada correctamente");
      navigate(previousUrl);
    }
  });

  const resultsQueries = useQueries({
    queries: [
      { queryKey: ['getEmployees', finca_id], queryFn: () => getEmployees(finca_id) },
      { queryKey: ['getTaskCrop', task_crop_id], queryFn: () => getTaskCrop(task_crop_id) },
    ]
  });

  const isLoading = resultsQueries.some(query => query.isLoading);

  useEffect(() => {
    if (resultsQueries[0].data) {
      setEmployees(resultsQueries[0].data)
    }
  }, [resultsQueries[0].data])

  useEffect(() => {
    if (resultsQueries[1].data) {
      setTaskCrop(resultsQueries[1].data)
    }
  }, [resultsQueries[1].data])

  useEffect(() => {
    setResults(employees);
  }, [employees]);

  const fuse = new Fuse(employees, {
    keys: ["name"],
    threshold: 0.4,
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    const result = input
      ? fuse.search(input).map((res) => res.item)
      : employees;
    setResults(result);
  };

  const handleAddEmployee = (employee: Employee) => {
    setAssignedEmployees((prev) => [...prev, employee]);
  };
  const handleRemoveEmployee = (employee: Employee) => {
    if (assignedEmployees.some((emp) => emp.emp_id === employee.emp_id)) {
      setAssignedEmployees(
        assignedEmployees.filter((emp) => emp.emp_id !== employee.emp_id)
      );
    }
  };

  const handleCloseAssignment = () => mutate({ assignedEmployees, id: taskCrop.id });

  if (isLoading) return <Spinner />
  return (
    <>
      <h1 className="text-4xl font-bold">Asignación de Empleados</h1>
      <div className="grid grid-cols-6 mt-10">
        <div className="col-span-4 space-y-5">
          <h2 className="font-bold text-2xl">Información de la tarea:</h2>
          <TaskLabel label="Tarea" text={taskCrop.task} />
          <TaskLabel label="Cultivo" text={taskCrop.cultivo} />

          <div className="mt-10 space-y-2 w-1/2 h-96 overflow-y-auto shadow-lg rounded-md p-5">
            <h2 className="font-bold text-xl">Empleados Asignados</h2>
            {assignedEmployees.length === 0 && (
              <p className="text-lg text-center">
                No hay empleados asignados
              </p>
            )}
            {assignedEmployees.map((employee) => (
              <div
                className="flex gap-2 p-2 justify-between bg-indigo-500 text-white rounded-md font-bold"
                key={employee.emp_id}
              >
                <p>{employee.name}</p>
                <Trash2Icon
                  className="hover:text-red-500 cursor-pointer"
                  onClick={() => handleRemoveEmployee(employee)}
                />
              </div>
            ))}
          </div>

          <button
            className={`p-2 rounded mt-5 uppercase font-bold transition-colors w-1/2 ${assignedEmployees.length === 0
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            onClick={handleCloseAssignment}
            disabled={assignedEmployees.length === 0 || isPending}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Cerrar Asignación</p>
            )}
          </button>
        </div>

        <div className="col-start-5 col-span-2">
          <div className="mt-5 overflow-y-auto h-96 shadow-lg rounded-md p-5 space-y-2">
            <p className="font-bold text-2xl text-center">
              Empleados Disponibles
            </p>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Buscar empleado..."
              className="border p-2 rounded mb-4 w-full text-lg"
            />
            {results.length === 0 && (
              <p className="text-lg text-center">No hay resultados</p>
            )}
            {results.map((employee) => (
              <Worker
                key={employee.emp_id}
                employee={employee}
                handleAddEmployee={handleAddEmployee}
                assignedEmployees={assignedEmployees}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
