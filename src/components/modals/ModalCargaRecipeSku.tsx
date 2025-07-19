import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { uploadSkusRecipes } from "@/api/SkusAPI";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    currentPage: number;

}

export default function ModalCargaRecipeSku({ modal, setModal, currentPage }: Props) {
    const [file, setFile] = useState<File[] | null>(null);
    const queryClient = useQueryClient();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File[]) => uploadSkusRecipes(file),
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getPaginatedLineasSKU', currentPage] });
        }
    });

    const handleCloseModal = () => {
        setModal(false);
        setFile(null);
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (file) {
            mutate(file);
        }
    };

    return (
        <Modal modal={modal} closeModal={handleCloseModal} title="Carga Masiva de Recetas">
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
