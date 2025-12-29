import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { uploadAssignments } from "@/api/TasksWeeklyPlanAPI";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "@/core/notifications/NotificationContext";


export default function ModalUploadAgricolaAssignments() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('upload');
    const open = modal ? true : false;

    const [file, setFile] = useState<File[] | null>(null);
    const notification = useNotification();
    const navigate = useNavigate();

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
        setFile(null);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: uploadAssignments,
        onSuccess: (data) => {
            notification.success(data!);
            handleCloseModal();
        },
        onError: (error) => {
            notification.error(error.message);
        }
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUploadAssignments = async () => {
        if (file) {
            mutate({ file: file[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUploadAssignments();
    };

    return (
        <Modal modal={open} closeModal={() => handleCloseModal()} title="Cambio de Fecha de Operación">
            <div className="flex items-center justify-center px-4">
                <div className="w-full  bg-white shadow-xl rounded-2xl p-8">
                    <form onSubmit={handleSubmit}>
                        <div
                            {...getRootProps()}
                            className={`transition-all duration-200 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
                                             ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-100 border-gray-300 hover:border-blue-400'}
                                             ${file ? 'border-green-400 bg-green-50' : ''}`}
                        >
                            <input {...getInputProps()} disabled={false || !!file} />
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

                            <button className="button bg-red-500 hover:bg-red-600 w-full" onClick={() => setFile(null)} type="button">
                                Limpiar Archivo
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
