import { LineWeeklyPlan } from "@/api/WeeklyProductionPlanAPI";
import { createAssigmentsProductionTasks } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
    linea: LineWeeklyPlan;
    refetch: () => Promise<QueryObserverResult<LineWeeklyPlan[]>>
}

export default function ModalCargaPosiciones({ isOpen, setIsOpen, linea, refetch }: Props) {
    const [file, setFile] = useState<File[] | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const { mutate, isPending } = useMutation({
        mutationFn: createAssigmentsProductionTasks,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setIsOpen(false);
            refetch();
            setFile(null);
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

    const handleCloseModal = () => {
        setFile(null);
        setIsOpen(false);
    }
    return (
        <Modal modal={isOpen} closeModal={handleCloseModal} title={`Carga de Asignaciónes ${linea.line}`}>
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

                    <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {isPending ? <Spinner /> : <p>Cargar Asignaciones</p>}
                    </button>
                </form>
            </div>
        </Modal>

    );
}


