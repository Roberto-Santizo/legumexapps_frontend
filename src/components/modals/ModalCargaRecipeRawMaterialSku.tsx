import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadSkusRecipesRawMaterial } from "@/api/SkusAPI";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

type Props = {
    currentPage: number;

}

export default function ModalCargaRecipeRawMaterialSku({ currentPage }: Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const flag = queryParams.get('uploadRawMaterialRecipe')!;
    const show = flag ? true : false;

    const [file, setFile] = useState<File[] | null>(null);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const notify = useNotification();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
        setFile(null);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File[]) => uploadSkusRecipesRawMaterial(file),
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data);
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ['getPaginatedLineasSKU', currentPage] });
        }
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (file) {
            mutate(file);
        }
    };

    return (
        <Modal modal={show} closeModal={handleCloseModal} title="Carga Masiva de Recetas Materia Prima">
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
