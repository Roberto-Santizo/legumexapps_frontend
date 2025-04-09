import { changePosition, EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/utilities-components/LoadingOverlay";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    employee: EmployeeProduction;
    availableEmployees: EmployeeProduction[];
    fijos: EmployeeProduction[];
    setEmployees: Dispatch<React.SetStateAction<EmployeeProduction[]>>;
}

export type DraftChangePosition = {
    assignment_id: EmployeeProduction['id'],
    new_name: EmployeeProduction['name'],
    new_code: EmployeeProduction['code'],
    new_position: EmployeeProduction['position'],
}

export default function ModalChangeEmployee({ modal, setModal, employee, availableEmployees, setEmployees, fijos }: Props) {

    const { mutate, isPending } = useMutation({
        mutationFn: changePosition,
        onError: () => {
            toast.error('Hubo un error al realizar el cambio de posición');
        },
        onSuccess: () => {
            toast.success('Cambio de posición realizada correctamente');
            setModal(false);
        }
    });

    const swapEmployees = (position: EmployeeProduction['position'], column_id: EmployeeProduction['column_id']) => {
        const newEmployee = employee;
        const oldEmployee = availableEmployees.filter(employee => employee.position === position)[0];
        const exists = fijos.findIndex(fijo => fijo.code === newEmployee.code);
        if (exists > 0) {
            toast.error('El empleado ya se encuentra asignado');
        } else {
            Swal.fire({
                title: "¿Deseas hacer el cambio de posición?",
                text: `Se cambiara a ${newEmployee.name} por ${oldEmployee.name}, este cambio no se podrá revertir`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "¡Si, cambiar!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    const data: DraftChangePosition = {
                        assignment_id: oldEmployee.id,
                        new_name: employee.name,
                        new_code: employee.code,
                        new_position: employee.position,
                    }

                    mutate(data);

                    setEmployees(prevEmployees =>
                        prevEmployees.map(emp => {
                            if (emp.position === position)
                                return { ...emp, column_id: employee.column_id };

                            if (emp.position === employee.position)
                                return { ...emp, column_id: column_id };

                            return emp;
                        })
                    );
                }
            });
        }
    }

    if (isPending) return <LoadingOverlay />
    return (
        <Modal modal={modal} closeModal={() => setModal(false)} title="Traslado de Empleados">
            <div className="p-5">
                <div className="flex justify-between font-bold uppercase">
                    <p>Nombre: {employee.name}</p>
                    <p>Posición: {employee.code}</p>
                </div>

                <div className="mt-5 flex flex-col gap-2 shadow-xl overflow-y-auto max-h-96 scrollbar-hide">
                    {availableEmployees.map(employee => (
                        <div key={employee.position} className="flex w-full justify-between shadow p-5 hover:bg-gray-200 cursor-pointer transition-colors font-medium" onClick={() => { swapEmployees(employee.position, employee.column_id) }}>
                            <p>{employee.name}</p>
                            <p>{employee.position}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>

    )
}
