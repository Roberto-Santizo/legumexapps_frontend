import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createProducer } from "@/api/ProducersAPI";
import { useMutation } from "@tanstack/react-query";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";

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

      <div>
        <form className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
              Nombre:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              placeholder="Nombre del productor"
              className="border border-black p-3"
              {...register('name', { required: 'El nombre del productor es obligatorio' })}
            />
            {errors.name?.message && <Error>{errors.name.message.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="code">
              Código:
            </label>
            <input
              autoComplete="off"
              id="code"
              type="text"
              placeholder="Código del productor"
              className="border border-black p-3"
              {...register('code', { required: 'El codigo del productor es obligatorio' })}
            />
            {errors.code?.message && <Error>{errors.code.message.toString()}</Error>}
          </div>

          <button className="button bg-indigo-500 hover:bg-indigo-600 min-w-full">
              {isPending ? <Spinner /> : <p>Crear Productor</p>}
          </button>
        </form>
      </div>
      
    </>
  );
}
