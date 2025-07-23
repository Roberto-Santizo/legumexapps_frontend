import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { createItemPackingMaterial } from "@/api/MaterialEmpaqueAPI";
import Spinner from "@/components/utilities-components/Spinner";
import FormRegistroMaterial from "./FormMaterialEmpaque";

export type DraftMaterialEmpaque = {
  name: string;
  description: string;
  code: string;
};

export default function CrearRegistroMaterial() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createItemPackingMaterial,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/material-empaque');
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftMaterialEmpaque>();

  const onSubmit = (data: DraftMaterialEmpaque) => { mutate(data) };

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear Item Material de Empaque</h2>
      <form
        className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <FormRegistroMaterial register={register} errors={errors} control={control}/>

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>
    </>
  );
}

