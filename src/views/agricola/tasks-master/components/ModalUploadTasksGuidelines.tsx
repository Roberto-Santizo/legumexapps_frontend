import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadTasksGuidelines } from "../api/TasksMasterAPI";
import Modal from "@/components/Modal";
import Spinner from "@/components/utilities-components/Spinner";

export default function ModalUploadTasksGuidelines() {
    const queryParams = new URLSearchParams(location.search);
    const flag = queryParams.get('upload')!;
    const show = flag ? true : false;
    const [_, setSearchParams] = useSearchParams();
    const [file, setFile] = useState<File[] | null>(null);
    const notify = useNotification();


    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const { mutate, isPending } = useMutation({
        mutationFn: uploadTasksGuidelines,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data!);
            setFile([]);
            handleCloseModal();
        }
    });

    const handleCloseModal = () => {
        setSearchParams((searchParams) => {
            searchParams.delete('upload');
            return searchParams;
        })
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            notify.error('El archivo es requerido');
            return;
        }

        mutate(file[0]);
    };

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Carga de Maestro de Tareas" >
            <div className="p-5">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div
                        {...getRootProps()}
                        className={`transition-all duration-200 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
                                              ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-100 border-gray-300 hover:border-blue-400'}
                                              ${file ? 'border-green-400 bg-green-50' : ''}`}
                    >
                        <input {...getInputProps()} disabled={isPending || !!file} />
                        {file ? (
                            <p className="text-green-600 font-medium">
                                Archivo: {file[0] ? file[0].name : ''}
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
        </Modal >
    )
}
