//EXTERNAL IMPORTS
import { useLocation, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";

//TYPES
import { Employee } from "../../../types";

//COMPONENTES
import { Trash2Icon } from "lucide-react";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Spinner from "../../../components/Spinner";
import Worker from "../../../components/Worker";
import { toast } from "react-toastify";

export default function AsignarTareaLote() {
  const { id } = useParams();
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/";

  const [query, setQuery] = useState<string>("");
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>([]);
  const getTask = useAppStore((state) => state.getTask);
  const getEmployees = useAppStore((state) => state.getEmployees);
  const task = useAppStore((state) => state.task);
  const reduceSlots = useAppStore((state) => state.reduceSlots);
  const addSlots = useAppStore((state) => state.addSlots);
  const employees = useAppStore((state) => state.employees);
  const closeAssigment = useAppStore((state) => state.closeAssigment);

  const loadingGetTask = useAppStore((state) => state.loadingGetTask);
  const loadingGetEmployees = useAppStore((state) => state.loadingGetEmployees);

  const fuse = new Fuse(employees, {
    keys: ["name"],
    threshold: 0.4,
  });

  const [results, setResults] = useState<Employee[]>(employees);

  useEffect(() => {
    if (id) {
      getTask(id);
      getEmployees(id);
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
    if(task.slots === 0) {toast.error("No puedes asignar más empleados a esta tarea"); return};

    setAssignedEmployees([...assignedEmployees, employee]);
    reduceSlots(task);
  };

  const handleRemoveEmployee = (employee: Employee) => {
    if (assignedEmployees.some((emp) => emp.emp_id === employee.emp_id)) {
      setAssignedEmployees(
        assignedEmployees.filter((emp) => emp.emp_id !== employee.emp_id)
      );
      addSlots(task);
      return;
    }
  }

  const handleCloseAssignment = () => {
    closeAssigment(assignedEmployees, task);
  }
  return (
    <>
      <h1 className="text-4xl font-bold">Asignación de Empleados</h1>
      <ReturnLink url={previousUrl} />

      {loadingGetTask && <Spinner />}
      {!loadingGetTask && (
        <div className="grid grid-cols-6 mt-10">
          <div className="col-span-4 splace-y-5">
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
                <span className="font-bold">Semana:</span> {task.week}
              </p>
            </div>

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
                  <p key={employee.emp_id}>{employee.name}</p>
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
              onClick={() => handleCloseAssignment()}
              disabled={assignedEmployees.length === 0}
            >
              Cerrar Asignación
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
