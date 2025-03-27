import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { createProductionPlan } from "@/api/WeeklyProductionPlanAPI";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

export default function CreatePlanSemanal() {
  const [file, setFile] = useState<File[] | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const {mutate,isPending} = useMutation({
    mutationFn: (file : File[]) => createProductionPlan(file),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/planes-produccion');
    }
  });

  const handleCreatePlan = async () => {
    if(file){
      mutate(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreatePlan();
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Plan Semanal de Producción</h2>
      <form className="w-1/2 mx-auto" onSubmit={handleSubmit}>
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={!file || isPending}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Plan</p>
          )}
        </Button>
      </form>
    </>
  );
}
