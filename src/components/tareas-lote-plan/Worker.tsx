import { UserIcon } from "lucide-react";
import { Employee } from "@/types";

type WorkerProps = {
  employee: Employee;
  handleAddEmployee: (employee: Employee) => void;
  assignedEmployees: Employee[];
};
export default function Worker({
  employee,
  handleAddEmployee,
  assignedEmployees,
}: WorkerProps) {
  const handleClick = (employee: Employee) => {
    handleAddEmployee(employee);
  };
  return (
    <button
      onClick={() => handleClick(employee)}
      disabled={assignedEmployees.some((emp) => emp.emp_id === employee.emp_id)}
      className={`text-base flex gap-2 p-2 rounded-md w-full font-bold transition-colors ${
        assignedEmployees.some((emp) => emp.emp_id === employee.emp_id)
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
    >
      <UserIcon />
      <p>{employee.name}</p>
    </button>
  );
}
