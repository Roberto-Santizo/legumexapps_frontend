import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createItemPackingMaterial } from "@/api/MaterialEmpaqueAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftItemMaterialEmpaque = {
  name: string;
  description: string;
  code: string;
};

export default function MaterialEmpaque() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DraftItemMaterialEmpaque>();

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

  const onSubmit = (data: DraftItemMaterialEmpaque) => mutate(data);
  return (
    <div>
      <h1 className="font-bold text-4xl">
        Crear Item Material Empaque
      </h1>
      <form className="w-3/4 mb-10 shadow-xl p-10 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent<DraftItemMaterialEmpaque>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre del material"
          register={register}
          validation={{ required: "El nombre del item es obligatorio" }}
          errors={errors}
          type={"text"}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftItemMaterialEmpaque>
          label="Descripcion"
          id="description"
          name="description"
          placeholder="Ingrese la descripción"
          register={register}
          validation={{ required: "La descripción es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.description && (
            <Error>{errors.description?.message?.toString()}</Error>
          )}
        </InputComponent>

        <InputComponent<DraftItemMaterialEmpaque>
          label="Código"
          id="code"
          name="code"
          placeholder="Ingrese el codigo del material"
          register={register}
          validation={{ required: "El código es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>
    </div>
  );
}
