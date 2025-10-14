import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateDraftWeeklyProductionPlanTasks } from "@/api/DraftWeeklyProductionPlanAPI";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export type DraftWeeklyProductionPlan = {
    week: number;
}


export default function ModalUpdateDraftTasks() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('updateDraftTasks')!;
    const show = modal ? true : false;
    const navigate = useNavigate();
    const notify = useNotification();
    const [file, setFile] = useState<File[] | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    const { mutate, isPending } = useMutation({
        mutationFn: updateDraftWeeklyProductionPlanTasks,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            handleCloseModal();
            notify.success(data ?? '');
        }
    });

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (file) {
            mutate(file);
        }
    };

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Actualización de Tareas">
            <div className="flex items-center justify-center p-10">
                <form className="w-full space-y-5" onSubmit={handleSubmit}>
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


                    <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {isPending ? <Spinner /> : <p>Actualizar</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
