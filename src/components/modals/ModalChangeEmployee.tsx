import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import { TaskProductionChange, TaskProductionEmployee } from "types/taskProductionPlanTypes";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    availableEmployees: TaskProductionEmployee[];
    setAvailableEmployees: Dispatch<SetStateAction<TaskProductionEmployee[]>>;
    selectedComodin: TaskProductionEmployee;
    setSelectedComodin: Dispatch<SetStateAction<TaskProductionEmployee>>;
    setChanges: Dispatch<SetStateAction<TaskProductionChange[]>>;
    setComodines: Dispatch<SetStateAction<TaskProductionEmployee[]>>;

}


export default function ModalChangeEmployee({ modal, setModal, availableEmployees, setAvailableEmployees, selectedComodin, setComodines, setSelectedComodin, setChanges }: Props) {


    const handleChangeEmployee = (employee: TaskProductionEmployee) => {
        const data = {
            new_employee: selectedComodin,
            old_employee: employee
        }

        setAvailableEmployees((prev) => prev.filter(auxemployee => auxemployee.code !== employee.code));
        setComodines((prev) => prev.filter(auxcomodin => auxcomodin.code !== selectedComodin.code));
        setChanges((prev) => [...prev, data]);
        setModal(false);
    }

    const handleCloseModal = () => {
        setModal(false);
        setSelectedComodin({} as TaskProductionEmployee);

    }
    return (
        <Modal modal={modal} closeModal={handleCloseModal} title="Cambio de empleado">
            <div className="p-6">
                <div className="flex justify-between font-semibold text-gray-800 text-lg mb-2">
                    <p>{selectedComodin.name}</p>
                    <p>{selectedComodin.code}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar border p-2">
                    <p className="font-medium">Empleados Disponible</p>
                    {availableEmployees.map((employee) => (
                        <div
                            key={employee.position}
                            className="flex justify-between items-center bg-white hover:bg-indigo-100 transition-colors duration-200 shadow-md rounded-xl px-5 py-4 cursor-pointer"
                            onClick={() => handleChangeEmployee(employee)}
                        >
                            <p className="text-gray-800 font-medium">{employee.name}</p>
                            <p className="text-indigo-600 font-semibold">{employee.position}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>


    )
}
