import { HistoryOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    changes: HistoryOperationDate[];
};

export default function ModalHistoryChangeOperation({ modal, setModal, changes }: Props) {
    return (
        <Modal modal={modal} closeModal={() => setModal(false)} title="Historial De Cambios">
            <div className="p-10 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {changes.length === 0 ? (
                    <p className="text-center text-gray-500">No hay cambios registrados.</p>
                ) : (
                    <ol className="relative border-l border-indigo-300">
                        {changes.map((change, index) => (
                            <li key={index} className="mb-10 ml-6">
                                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white ring-8 ring-white">
                                    🕒
                                </span>
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {change.created_at}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600">
                                    <strong>Razón:</strong> {change.reason}
                                </p>
                                {change.original_date && change.new_date && (
                                    <p className="text-sm text-gray-600">
                                        <strong>Fecha Anterior:</strong> {change.original_date}<br />
                                        <strong>Fecha Nueva:</strong> {change.new_date}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    <strong>Cambio realizado por:</strong> {change.user}<br />
                                </p>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </Modal>
    );
}
