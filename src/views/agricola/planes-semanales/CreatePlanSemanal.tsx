import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppStore } from "../../../stores/useAppStore";
import { useNavigate } from "react-router-dom";

//COMPONENTES
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import Error from "../../../components/Error";
import Spinner from "../../../components/Spinner";

export default function CreatePlanSemanal() {
  const [file, setFile] = useState<File[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const errorsCreatePlan = useAppStore((state) => state.errorsCreatePlan);
  const createPlan = useAppStore((state) => state.createPlan);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCreatePlan = async () => {
    setLoading(true);

    try {
      if (file) {
        await createPlan(file);
        navigate("/planes-semanales");
        toast.success("Plan Creado Correctamente");
      }
    } catch (error) {
      setError(true);
      toast.error('Existe un error al crear el plan semanal');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreatePlan();
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Plan Semanal</h2>
      <form className="w-1/2 mx-auto" onSubmit={handleSubmit}>
        {error && <Error>{errorsCreatePlan}</Error>}
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
            <p className="font-bold text-lg">Crear Plan Semanal</p>
          )}
        </Button>
      </form>
    </>
  );
}
