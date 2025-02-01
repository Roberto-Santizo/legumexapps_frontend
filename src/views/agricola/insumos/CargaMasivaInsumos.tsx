import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Spinner from "../../../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import Error from "../../../components/Error";

export default function CargaMasivaInsumos() {
    const [file, setFile] = useState<File[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const insumoErrors = useAppStore((state) => state.insumosErrors);
    const uploadInsumos = useAppStore((state) => state.uploadInsumos);
    const navigate = useNavigate();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles) {
            setFile(acceptedFiles);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUploadFile = async () => {
        setLoading(true);
        try {
          if(file){
            await uploadInsumos(file);
            navigate("/insumos");
            toast.success("Insumos Creados Correctamente");
          }
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleUploadFile();
      };
    
    return (
        <>
            <h2 className="font-bold text-4xl">Carga Masiva de Insumos</h2>
            <form className="w-1/2 mx-auto mt-5" onSubmit={handleSubmit}>
                {error && <Error>{insumoErrors}</Error>}
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
                    <input {...getInputProps()} disabled={loading || !!file} />
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

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={!file || loading}
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <p className="font-bold text-lg">Crear Insumos</p>
                    )}
                </Button>
            </form>
        </>
    )
}
