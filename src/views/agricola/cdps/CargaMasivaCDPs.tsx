import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";

import { uploadCDPS } from "@/api/PlantationControlAPI";

export default function CargaMasivaCDPs() {
  const [file, setFile] = useState<File[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      if (file) {
        const errors = await uploadCDPS(file);
        if (errors) {
          toast.error(errors);
          return;
        }
        navigate("/cdps");
        toast.success("CDPS creados correctamente");
      }
    } catch (error) {
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
      <h2 className="font-bold text-4xl">Carga Masiva de CDPS</h2>
      <form className="w-1/2 mx-auto mt-5" onSubmit={handleSubmit}>
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
            <p className="font-bold text-lg">Crear CDPS</p>
          )}
        </Button>
      </form>
    </>
  );
}
