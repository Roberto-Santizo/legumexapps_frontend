import { HistoryOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    changes: HistoryOperationDate[];
};

export default function ModalHistoryChangeOperation({ modal, setModal, changes }: Props) {
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden bg-white rounded-2xl shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        Historial de Cambios
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => setModal(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    );
}
