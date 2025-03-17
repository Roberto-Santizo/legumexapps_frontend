import { LineWeeklyPlan } from "@/api/WeeklyProductionPlanAPI";
import { createAssigmentsProductionTasks } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, useCallback, useState } from "react";
import { Button } from "@mui/material";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
    linea: LineWeeklyPlan
}

export default function ModalCargaPosiciones({ isOpen, setIsOpen, linea }: Props) {
    const [file, setFile] = useState<File[] | null>(null);
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const { mutate, isPending } = useMutation({
        mutationFn: ({file} : {file : File[], id : LineWeeklyPlan['id']}) => createAssigmentsProductionTasks(file,linea.id),
        onError: () => {
            toast.error('Hubo un error al cargar el archivo');
        },
        onSuccess: () => {
            toast.success('Los datos f');
            navigate('/planes-produccion');
        }
    });

    const handleCreatePlan = async () => {
        if (file) {
            mutate({ file, id: linea.id });
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
                                        Carga de Plantilla {linea.line}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => { setIsOpen(false) }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="p-10">
                                    <form onSubmit={handleSubmit}>
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

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ marginTop: 2 }}
                                            disabled={!file || isPending}
                                        >
                                            {isPending ? (
                                                <Spinner />
                                            ) : (
                                                <p className="font-bold text-lg">Crear Plan</p>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    );
}


