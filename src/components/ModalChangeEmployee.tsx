import { EmployeeProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import Swal from "sweetalert2";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    employee: EmployeeProduction;
    availableEmployees: EmployeeProduction[];
    setEmployees: Dispatch<React.SetStateAction<EmployeeProduction[]>>;
}

export default function ModalChangeEmployee({ modal, setModal, employee, availableEmployees, setEmployees }: Props) {

    const swapEmployees = (position: EmployeeProduction['position'], column_id: EmployeeProduction['column_id']) => {
        Swal.fire({
            title: "¿Deseas hacer el cambio de empleado?",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
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

        setModal(false);
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
