import { useLocation, useSearchParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan } from "../api/PlannerAPI";
import Modal from "@/components/Modal";
import Spinner from "@/components/utilities-components/Spinner";

export default function ModalUpload() {
    const location = useLocation();
    const notify = useNotification();
    const queryClient = useQueryClient();

    const queryParams = new URLSearchParams(location.search);
    const flag = queryParams.get('upload')!;
    const show = flag ? true : false;
    const [searchParams, setSearchParams] = useSearchParams();
    const [file, setFile] = useState<File[] | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


    const handleCloseModal = () => {
        setSearchParams((searchParams) => {
            searchParams.delete('upload');
            return searchParams;
        })
    }


    const { mutate, isPending } = useMutation({
        mutationFn: createPlan,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data!);
            queryClient.invalidateQueries({ queryKey: ['getDraftWeeklyPlans', searchParams.get('page'), searchParams.get('rowsPerPage')] })
            handleCloseModal();
        }

    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            notify.error('El archivo es requerido');
            return;
        }

        mutate(file[0]);
    };

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Cargar Plan de Siembras" >
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

    );
}
