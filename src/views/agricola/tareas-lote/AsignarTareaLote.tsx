// EXTERNAL IMPORTS
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Swal from "sweetalert2";
// TYPES
import { Employee, TaskWeeklyPlan } from "../../../types";

// COMPONENTS
import { Trash2Icon } from "lucide-react";
import Spinner from "../../../components/Spinner";
import Worker from "../../../components/Worker";
import { toast } from "react-toastify";

export default function AsignarTareaLote() {
  const { finca_id, task_id } = useParams();
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";

  const [loadingGetTask, setLoadingGetTask] = useState<boolean>(false);
  const [loadingGetEmployees, setLoadingGetEmployees] = useState<boolean>(false);
  const [loadingCloseTask, setLoadingCloseTask] = useState<boolean>(false);
  const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [query, setQuery] = useState<string>("");
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);

  const getTask = useAppStore((state) => state.getTask);
  const getEmployees = useAppStore((state) => state.getEmployees);

  const closeAssigment = useAppStore((state) => state.closeAssigment);
  const navigate = useNavigate();

  const necesarySlots = useMemo(() => {
    return assignedEmployees.length >= task.minimum_slots;
  }, [assignedEmployees, task.minimum_slots]);

  const fuse = new Fuse(employees, {
    keys: ["name"],
    threshold: 0.4,
  });

  const [results, setResults] = useState<Employee[]>(employees);


  const handleGetTask = async () => {
    setLoadingGetTask(true);
    try {
      if (task_id) {
        const task = await getTask(task_id);
        setTask(task);
      }
    } catch (error) {
      toast.error('Error al traer la tarea, intentelo de nuevo más tarde');
    } finally {
      setLoadingGetTask(false);
    }
  }

  const handleGetEmployees = async () => {
    setLoadingGetEmployees(true);
    try {
      if (finca_id) {
        const employees = await getEmployees(finca_id);
        setEmployees(employees)
      }
    } catch (error) {
      toast.error('Error al traer a los empleados, intentelo de nuevo más tarde');
    } finally {
      setLoadingGetEmployees(false);
    }
  }

  const isValidTask = () => {
    if (task.start_date != null) {
      return true
    }

    return false;
  }

  const reduceSlots = (task: TaskWeeklyPlan) => {
    const updatedTask = { ...task, slots: task.slots - 1 };
    setTask(updatedTask);
  }

  const addSlots = (task: TaskWeeklyPlan) => {
    const updatedTask = { ...task, slots: task.slots + 1 };
    setTask(updatedTask);
  }

  useEffect(() => {
    handleGetTask();
    handleGetEmployees();
    if (!isValidTask()) {
      navigate('/planes-semanales')
      toast.error('La tarea ya cuenta con asignación');
    }
  }, []);



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
          setLoadingCloseTask(true)
          try {
            closeAssigment(assignedEmployees, task.id);
            toast.success("Asignación cerrada correctamente");
            navigate(previousUrl);
          } catch (error) {
            toast.error("Hubo un error al cerrar la asignación");
          } finally {
            setLoadingCloseTask(false);
          }
        }
      });
      return;
    }

    try {
      closeAssigment(assignedEmployees, task.id);
      toast.success("Asignación cerrada correctamente");
      navigate(previousUrl);
    } catch (error) {
      toast.error("Hubo un error al cerrar la asignación");
    } finally {
      setLoadingCloseTask(true);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Asignación de Empleados</h1>

      {loadingGetTask && <Spinner />}
      {(!loadingGetTask && task.insumos) && (
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

              <div>
                <h2 className="font-bold text-2xl">Insumos Asignados:</h2>
                <table className="table">
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
                          <p>{insumo.assigned_quantity} {insumo.measure}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

          {loadingGetEmployees && <Spinner />}
          {!loadingGetEmployees && (
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
          )}
        </div>
      )}

      <button
        className={`p-2 rounded mt-5 uppercase font-bold transition-colors w-1/2 mx-auto flex justify-center items-center ${(assignedEmployees.length === 0 || loadingCloseTask)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        onClick={handleCloseAssignment}
        disabled={assignedEmployees.length === 0 || loadingCloseTask}
      >
        {loadingCloseTask ? <Spinner /> : (<p>Cerrar Asignación</p>)}
      </button>
    </>
  );
}
