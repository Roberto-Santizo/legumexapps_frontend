import { useLocation, useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { createProductionPlan } from "@/api/WeeklyProductionPlanAPI";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

type Props = {
    setErrors: Dispatch<SetStateAction<string[]>>;
    setModalErrors: Dispatch<SetStateAction<boolean>>;
    currentPage: number;
}

export default function ModalCreateProductionPlan({ setErrors, setModalErrors, currentPage }: Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('createPlan')!;
    const show = modal ? true : false;
    const [file, setFile] = useState<File[] | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const handleCloseModal = () => {
        navigate(location.pathname);
        setFile(null);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File[]) => createProductionPlan(file),
        onError: (error: any) => {
            if (error.type === 'validation') {
                setErrors(error.messages);
                setModalErrors(true);
            } else if (error.type === 'general') {
                toast.error(error.message);
            } else {
                toast.error("Error desconocido al cargar el plan.");
            }
            queryClient.invalidateQueries({ queryKey: ['getPaginatedWeeklyProductionPlans', currentPage] });
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getPaginatedWeeklyProductionPlans', currentPage] });
            handleCloseModal();
        }
    });

    const handleCreatePlan = async () => {
        if (file) {
            mutate(file)
        } else {
            toast.error('Debe cargar un archivo')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCreatePlan();
    };

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Plan Semanal Producción">
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

                        <div className="flex xl:flex-row flex-col justify-center items-center gap-2 mt-5">
                            <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                                {isPending ? <Spinner /> : <p>Crear</p>}
                            </button>

                            <button disabled={isPending} className="button bg-red-500 hover:bg-red-600 w-full" onClick={() => setFile(null)} type="button">
                                {isPending ? <Spinner /> : <p>Limpiar Archivo</p>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
