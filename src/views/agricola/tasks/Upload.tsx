import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { uploadTareas } from "@/api/TasksAPI";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Upload() {
  const [file, setFile] = useState<File[] | null>(null);
  const navigate = useNavigate();
  const notify = useNotification();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { mutate, isPending } = useMutation({
    mutationFn: uploadTareas,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/tareas');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      mutate(file)
    }
  };

  return (
    <>
      <h2 className="font-bold text-4xl">Carga Masiva de Tareas</h2>
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

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-2">
          {isPending ? <Spinner /> : <p>Crear Tareas</p>}
        </button>
      </form>
    </>
  );
}
