import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createProducer } from "@/api/ProducersAPI";
import { useMutation } from "@tanstack/react-query";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import InputComponent from "@/components/form/InputComponent";

export type DraftProducer = {
  code: string,
  name: string
}

export default function CreateProducer() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProducer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/productores');
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftProducer>();

  const onSubmit = async (data: DraftProducer) => mutate(data);
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Productor</h2>

      <form className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftProducer>
            label="Nombre del Productor"
            id="name"
            name="name"
            placeholder="Nombre del Productor"
            register={register}
            validation={{required: 'El nombre del productor es obligatorio'}}
            errors={errors}
            type={'text'}
        >
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftProducer>
            label="Código"
            id="code"
            name="code"
            placeholder="Código del Productor"
            register={register}
            validation={{required: 'El codigo del productor es obligatorio'}}
            errors={errors}
            type={'text'}
        >
            {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <button className="button bg-indigo-500 hover:bg-indigo-600 min-w-full">
          {isPending ? <Spinner /> : <p>Crear Productor</p>}
        </button>
      </form>
    </>
  );
}
