import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { DraftProducer } from "@/types";
import Error from "@/components/Error";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProducer } from "@/api/ProducersAPI";
import { useMutation } from "@tanstack/react-query";

export default function CreateProducer() {
  const navigate = useNavigate();


  const { mutate, isPending } = useMutation({
    mutationFn: createProducer,
    onError: () => {
      toast.error('Hubo un error al crear el productor');
    },
    onSuccess: () => {
      toast.success('Productor creado correctamente');
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

          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Productor</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
