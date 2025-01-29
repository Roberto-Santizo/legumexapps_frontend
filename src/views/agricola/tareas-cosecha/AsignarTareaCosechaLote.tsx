import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { ChangeEvent, useEffect, useState } from "react";
import Spinner from "../../../components/Spinner";
import TaskLabel from "../../../components/TaskLabel";
import { Employee } from "../../../types";
import { Trash2Icon } from "lucide-react";
import Fuse from "fuse.js";
import Worker from "../../../components/Worker";
import { toast } from "react-toastify";

export default function AsignarTareaCosechaLote() {
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";
  const { task_crop_id, finca_id } = useParams();

  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState<string>("");

  const getCropEmployees = useAppStore((state) => state.getCropEmployees);
  const loadingGetTask = useAppStore((state) => state.loadingGetTask);
  const loadingGetEmployees = useAppStore((state) => state.loadingGetEmployees);
  const loadingCloseAssigment = useAppStore(
    (state) => state.loadingCloseAssigment
  );
  const getTaskCrop = useAppStore((state) => state.getTaskCrop);
  const employees = useAppStore((state) => state.employees);
  const taskCrop = useAppStore((state) => state.taskCrop);
  const closeCropAssigment = useAppStore((state) => state.closeCropAssigment);

  const [results, setResults] = useState<Employee[]>(employees);
  const navigate = useNavigate();

  useEffect(() => {
    if (finca_id && task_crop_id) {
      getTaskCrop(task_crop_id);
      getCropEmployees(finca_id);
    }
  }, []);

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

  const handleCloseAssignment = () => {
    try {
      closeCropAssigment(assignedEmployees, taskCrop.id);
      toast.success("Asignación cerrada correctamente");
      navigate(previousUrl);
    } catch (error) {
      toast.error("Hubo un error al cerrar la asignación");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Asignación de Empleados</h1>
      {loadingGetTask && <Spinner />}
      {!loadingGetTask && (
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
              className={`p-2 rounded mt-5 uppercase font-bold transition-colors w-1/2 ${
                assignedEmployees.length === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
              onClick={handleCloseAssignment}
              disabled={assignedEmployees.length === 0 || loadingCloseAssigment}
            >
              {loadingCloseAssigment ? (
                <Spinner />
              ) : (
                <p className="font-bold text-lg">Cerrar Asignación</p>
              )}
            </button>
          </div>

          {loadingGetEmployees && <Spinner />}
          {!loadingGetEmployees && (
            <div className="col-start-5 col-span-2">
              <div className="mt-5 overflow-y-auto h-5/6 shadow-lg rounded-md p-5 space-y-2">
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
    </>
  );
}
