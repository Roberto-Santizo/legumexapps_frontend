import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {getProveedorById, updateProveedor} from "@/api/BodegaProveedoresAPI"
import { DraftSuppliers } from "../formularios/CrearProveedor";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import FormProveedor from "../formularios/FormProveedor";

export default function EditarProveedores() {
  const params = useParams();
  const id = params.id!!;
  const navigate = useNavigate();

  const { data: editingProveedor, isLoading, isError } = useQuery({
    queryKey: ['getProveedorById', id],
    queryFn: () => getProveedorById(id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProveedor,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/proveedor');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DraftSuppliers>();

  useEffect(() => {
    if (editingProveedor) {
      setValue("code", editingProveedor.code || "");
      setValue("name", editingProveedor.name || "");
      
    }
  }, [editingProveedor, setValue]);


  const onSubmit = (data: DraftSuppliers) => mutate({ id, FormData: data })

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (editingProveedor) return (
    <>
      <h2 className="text-4xl font-bold">Editar Proveedor {editingProveedor.name}</h2>
      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormProveedor register={register} errors={errors} />

          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
          </button>
        </form>
      </div>
    </>
  );
}
