import { LineWeeklyPlan } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
    linea: LineWeeklyPlan
}

export default function ModalCargaPosiciones({ isOpen,setIsOpen, linea }: Props) {

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
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
                                        Carga de Plantilla {linea.line}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => {setIsOpen(false)}}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div>
                                    <form>
                                        
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
