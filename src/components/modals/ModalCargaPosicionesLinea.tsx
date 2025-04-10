import { Dispatch, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePositionsLine } from "@/api/LineasAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalCargaPosicionesLinea({ isOpen, setIsOpen }: Props) {
    const params = useParams();
    const line_id = params.id!!;
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File[] | null>(null);

    const { mutate, isPending } = useMutation({
        mutationFn: updatePositionsLine,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
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

    return (
        <Modal modal={isOpen} closeModal={() => setIsOpen(false)} title="Carga de Posiciones">
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

                    <button type="submit" className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {isPending ? <Spinner /> : <p>Cargar Posiciones</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
