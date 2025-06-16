import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createInsumo } from "@/api/InsumosAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import { DraftInsumo } from "types/insumoTypes";

export default function CrearInsumo() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createInsumo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/insumos');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftInsumo>();

  const handleCreateInsumo = async (data: DraftInsumo) => mutate(data);

  return (
    <>
      <h2 className="font-bold text-4xl">Crear Insumo</h2>

      <form
        className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(handleCreateInsumo)}
      >

        <InputComponent<DraftInsumo>
          label="Nombre del Insumo"
          id="name"
          name="name"
          placeholder="Nombre del insumo"
          register={register}
          validation={{ required: 'El nombre del insumo es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftInsumo>
          label="Codigo del Insumo"
          id="code"
          name="code"
          placeholder="Codigo del Insumo"
          register={register}
          validation={{ required: 'El codigo del insumo es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftInsumo>
          label="Unidad de Medida"
          id="measure"
          name="measure"
          placeholder="Unidad de medida del Insumo"
          register={register}
          validation={{ required: 'La unidad de medida del insumo es obligatoria' }}
          errors={errors}
          type={'text'}
        >
          {errors.measure && <Error>{errors.measure?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Insumo</p>}
        </button>
      </form>
    </>
  );
}
