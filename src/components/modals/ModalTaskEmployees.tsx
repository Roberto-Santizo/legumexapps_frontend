import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import { TaskProductionEmployee } from "types/taskProductionPlanTypes";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    employees: TaskProductionEmployee[];
}

export default function ModalTaskEmployees({ open, setOpen, employees }: Props) {
    return (
        <Modal modal={open} closeModal={() => setOpen(false)} title="Empleados Asignados" width="w-2/3">
            <div className="p-10 space-y-5" >
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr className="thead-tr">
                                <th className="thead-th">Código</th>
                                <th className="thead-th">Empleado</th>
                                <th className="thead-th">Posición</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id} className="tbody-tr">
                                    <td className="tbody-td">{employee.code}</td>
                                    <td className="tbody-td">{employee.name}</td>
                                    <td className="tbody-td">{employee.position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    )
}
