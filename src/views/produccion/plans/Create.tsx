import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createProductionPlan } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ModalErrorsTable from "@/components/modals/ModalErrorsTable";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Create() {
  const [file, setFile] = useState<File[] | null>(null);
  const [errores, setErrores] = useState<string[]>([]);
  const [modalErrors, setModalErrors] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotification();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile(acceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const { mutate, isPending } = useMutation({
    mutationFn: (file: File[]) => createProductionPlan(file),
    onError: (error) => {
      const erroresCapturados = error.message.split('\n').slice(1);
      setErrores(erroresCapturados);
      setModalErrors(true);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/planes-produccion');
    }
  });

  const handleCreatePlan = async () => {
    if (file) {
      mutate(file)
    } else {
      notify.error('Debe cargar un archivo')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreatePlan();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear Plan Semanal de Producción
        </h2>

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

      <ModalErrorsTable modal={modalErrors} setModal={setModalErrors} errors={errores} />
    </div>
  );
}
