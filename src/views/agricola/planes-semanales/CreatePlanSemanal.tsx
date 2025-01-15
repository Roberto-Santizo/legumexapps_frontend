import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppStore } from "../../../stores/useAppStore";
import { useNavigate } from "react-router-dom";

//COMPONENTES
import { Button } from "@mui/material";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { toast } from "react-toastify";

export default function CreatePlanSemanal() {
  const [file, setFile] = useState<File[] | null>(null);
  const loadingCreatePlan = useAppStore((state) => state.loadingCreatePlan);
  const uploadedFile = useAppStore((state) => state.uploadedFile);
  const createPlan = useAppStore((state) => state.createPlan);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if(acceptedFiles){
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      createPlan(file).then(() => {
        navigate('/planes-semanales');
        toast.success('Plan Creado Correctamente');
      });
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Plan Semanal</h2>
      <ReturnLink url="/planes-semanales" />

      <form className="w-1/2 mx-auto" onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #cccccc",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#e3f2fd" : "#f9f9f9",
          }}
        >
          <input
            {...getInputProps()}
            disabled={loadingCreatePlan || !!uploadedFile}
          />
          {file ? (
            <p className="text-green-600 font-medium">Archivo: {file[0].name}</p>
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
          disabled={!file || loadingCreatePlan}
        >
          <p className="font-bold text-lg">Crear Plan Semanal</p>
        </Button>
      </form>
    </>
  );
}
