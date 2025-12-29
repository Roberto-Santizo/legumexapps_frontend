import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePositionsLine } from "@/api/LinesAPI";
import { useParams } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";
import { useNotification } from "../../core/notifications/NotificationContext";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalCargaPosicionesLinea({ isOpen, setIsOpen }: Props) {
    const params = useParams();
    const line_id = params.id!;
    const queryClient = useQueryClient();
    const notify = useNotification();
    
    const [file, setFile] = useState<File[] | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: updatePositionsLine,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data);
            setIsOpen(false);
            setFile(null);
            queryClient.invalidateQueries({ queryKey: ['getLineaById', line_id] });
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

    const handleCloseModal = () => {
        setIsOpen(false);
        setFile(null);
    }

    return (
        <Modal modal={isOpen} closeModal={(handleCloseModal)} title="Carga Masiva de Recetas">
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
    )
}
