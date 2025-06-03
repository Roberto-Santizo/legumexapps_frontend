import { createProveedor } from "@/api/BodegaProveedoresAPI";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import FormularioProveedor from "./FormularioProveedor";

export type DraftSuppliers = {
  code: string;
  name: string;
};

export default function CrearProveedor() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProveedor,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/proveedores');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftSuppliers>();

  const onSubmit = (data: DraftSuppliers) => { mutate(data) };

  return (
    <>
      <h2 className="text-4xl font-bold">Proveedor</h2>
      <form
        className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <FormularioProveedor register={register} errors={errors} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Proveedor</p>}
        </button>
      </form>
    </>
  );
}

