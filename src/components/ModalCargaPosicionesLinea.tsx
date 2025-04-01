import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Fragment } from "react/jsx-runtime";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePositionsLine } from "@/api/LineasAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalCargaPosicionesLinea({ isOpen, setIsOpen }: Props) {
    const params = useParams();
    const line_id = params.id!!;
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File[] | null>(null);

    const { mutate, isPending } =  useMutation({
        mutationFn: updatePositionsLine,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setIsOpen(false);
            setFile(null);
            queryClient.invalidateQueries({queryKey:['getLineaById',line_id]});
        }
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleCreatePlan = async () => {
        if (file) {
            mutate({ file, id: line_id });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCreatePlan();
    };

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
                                        Carga de Plantilla
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => { setIsOpen(false) }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-10">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div
                                            className="mt-5"
                                            {...getRootProps()}
                                            style={{
                                                border: "2px dashed #cccccc",
                                                borderRadius: "10px",
                                                padding: "20px",
                                                textAlign: "center",
                                                backgroundColor: isDragActive ? "#e3f2fd" : "#f9f9f9",
                                            }}
                                        >
                                            <input {...getInputProps()} disabled={isPending || !!file} />
                                            {file ? (
                                                <p className="text-green-600 font-medium">
                                                    Archivo: {file[0].name}
                                                </p>
                                            ) : isDragActive ? (
                                                <p className="uppercase font-medium text-blue-500">
                                                    Suelta el archivo aquí
                                                </p>
                                            ) : (
                                                <p className="uppercase font-medium text-blue-500">
                                                    Arrastra el archivo acá
                                                </p>
                                            )}
                                        </div>

                                        <button type="submit" className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                                            {isPending ? <Spinner /> : <p>Cargar Posiciones</p>}
                                        </button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}
