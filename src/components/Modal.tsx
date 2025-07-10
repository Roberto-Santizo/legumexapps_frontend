import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type Props = {
    modal: boolean;
    closeModal: () => void;
    title: string;
    children: ReactNode;
    width?: string;
}

export default function Modal({ modal, closeModal, title, children, width = 'sm:w-full sm:max-w-3xl' }: Props) {
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-[10050]" onClose={() => closeModal()}>
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

                <div className="fixed inset-0 overflow-y-auto scrollbar-hide">
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
                            <Dialog.Panel className={`relative transform bg-white shadow-xl ${width}`}>
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        {title}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => closeModal()}
                                    >
                                        ✕
                                    </button>

                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
