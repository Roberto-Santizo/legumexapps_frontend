import { changePosition, EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    employee: EmployeeProduction;
    availableEmployees: EmployeeProduction[];
    setEmployees: Dispatch<React.SetStateAction<EmployeeProduction[]>>;
}

export type DraftChangePosition = {
    assignment_id: EmployeeProduction['id'],
    new_name: EmployeeProduction['name'],
    new_code: EmployeeProduction['code'],
    new_position: EmployeeProduction['position'],
}

export default function ModalChangeEmployee({ modal, setModal, employee, availableEmployees, setEmployees }: Props) {

    const { mutate } = useMutation({
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
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden bg-white shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        Empleados Disponibles
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => setModal(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between font-bold uppercase">
                                        <p>Nombre: {employee.name}</p>
                                        <p>Posición: {employee.position}</p>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-2 shadow-xl">
                                        {availableEmployees.map(employee => (
                                            <div key={employee.position} className="flex w-full justify-between shadow p-5 hover:bg-gray-200 cursor-pointer transition-colors font-medium" onClick={() => { swapEmployees(employee.position, employee.column_id) }}>
                                                <p>{employee.name}</p>
                                                <p>{employee.position}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}
