import { useLocation, useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Employee, TaskWeeklyPlan } from "@/types";
import { Trash2Icon } from "lucide-react";
import Spinner from "@/components/Spinner";
import Worker from "@/components/Worker";
import { toast } from "react-toastify";
import { closeAssigment, getEmployees, getTask } from "@/api/TasksWeeklyPlanAPI";
import { useMutation, useQueries } from "@tanstack/react-query";

export default function AsignarTareaLote() {
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
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ Employees, task_id }: { Employees: Employee[], task_id: TaskWeeklyPlan['id'] }) => closeAssigment(Employees, task_id),
    onError: () => {
      toast.error('Hubo un error al cerrar la asignación');
    },
    onSuccess: () => {
      toast.success("Asignación cerrada correctamente");
      navigate(previousUrl);
    }
  });

  const resultsQuery = useQueries({
    queries: [
      { queryKey: ['getTask', task_id], queryFn: () => getTask(task_id) },
      { queryKey: ['getEmployees', finca_id], queryFn: () => getEmployees(finca_id) }
    ]
  });

  useEffect(() => {
    if (resultsQuery[0].data) setTask(resultsQuery[0].data);
    if (resultsQuery[1].data) setEmployees(resultsQuery[1].data);
  }, [resultsQuery]);

  const isLoading = resultsQuery.some(result => result.isFetching);

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
  return (
    <>
      <h1 className="text-4xl font-bold">Asignación de Empleados</h1>

      <div className="flex flex-col md:grid md:grid-cols-6 mt-10">
        <div className="grid md:grid-cols-2 col-span-4 gap-5">
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-2xl">Información de la tarea:</h2>
              <p className="text-lg">
                <span className="font-bold">Cupos Dispoibles:</span>{" "}
                {task.slots}
              </p>
              <p className="text-lg">
                <span className="font-bold">Tarea:</span> {task.task}
              </p>
              <p className="text-lg">
                <span className="font-bold">Finca:</span> {task.lote}
              </p>
              <p className="text-lg">
                <span className="font-bold">Semana:</span> {task.week}
              </p>
              <p className="text-lg">
                <span className="font-bold">Cupos Minimos:</span>{" "}
                {task.minimum_slots}
              </p>
            </div>

            {task.insumos.length > 0 && (
              <div>
                <h2 className="font-bold text-2xl">Insumos Asignados:</h2>
                <table className="table mt-5">
                  <thead>
                    <tr className="thead-tr">
                      <th scope="col" className="thead-th">
                        Insumo
                      </th>
                      <th scope="col" className="thead-th">
                        Cantidad Asignada
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.insumos.map((insumo) => (
                      <tr className="tbody-tr" key={insumo.id}>
                        <td className="tbody-td">
                          <p>{insumo.name} </p>
                        </td>
                        <td className="tbody-td">
                          <p>
                            {insumo.assigned_quantity} {insumo.measure}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-bold text-xl">Empleados Asignados</h2>
            <div className="mt-10 space-y-2 h-96 overflow-y-auto shadow-lg rounded-md p-5">
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
          </div>
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

      <button
        className={`p-2 rounded mt-5 uppercase font-bold transition-colors w-1/2 mx-auto flex justify-center items-center ${assignedEmployees.length === 0 || isPending
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        onClick={handleCloseAssignment}
        disabled={assignedEmployees.length === 0 || isPending}
      >
        {isPending ? <Spinner /> : <p>Cerrar Asignación</p>}
      </button>
    </>
  );
}
