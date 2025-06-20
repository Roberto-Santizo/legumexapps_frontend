import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LineWeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import { createAssigmentsProductionTasks } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useParams } from "react-router-dom";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
    linea: LineWeeklyProductionPlan;
}

export default function ModalCargaPosiciones({ isOpen, setIsOpen, linea }: Props) {
    const [file, setFile] = useState<File[] | null>(null);
    const params = useParams();
    const id = params.plan_id!!;

    const queryClient = useQueryClient();

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
            setFile(null);
            queryClient.invalidateQueries({ queryKey: ['getWeeklyPlanDetails', id] });
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
        <Modal modal={isOpen} closeModal={handleCloseModal} title="Carga de Posiciones">
            <div className="flex items-center justify-center px-4">
                <div className="w-full  bg-white shadow-xl rounded-2xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div
                            {...getRootProps()}
                            className={`transition-all duration-200 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
                                  ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-100 border-gray-300 hover:border-blue-400'}
                                  ${file ? 'border-green-400 bg-green-50' : ''}`}
                        >
                            <input {...getInputProps()} disabled={isPending || !!file} />
                            {file ? (
                                <p className="text-green-600 font-medium">
                                    Archivo: {file[0].name}
                                </p>
                            ) : isDragActive ? (
                                <p className="text-blue-600 font-medium uppercase">
                                    Suelta el archivo aquí
                                </p>
                            ) : (
                                <p className="text-gray-600 font-medium uppercase">
                                    Arrastra o haz clic para subir el archivo
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center items-center gap-2 mt-5">
                            <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                                {isPending ? <Spinner /> : <p>Crear</p>}
                            </button>

                            <button className="button bg-red-500 hover:bg-red-600 w-full" onClick={() => setFile(null)} type="button">
                                Limpiar Archivo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>


    );
}


