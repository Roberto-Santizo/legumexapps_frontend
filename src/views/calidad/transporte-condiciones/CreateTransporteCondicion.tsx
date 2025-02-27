import Spinner from "@/components/Spinner";
import { DraftTransporteCondicion } from "@/types";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createTransporteCondicion } from "@/api/BoletaTransporteAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Error from "@/components/Error";

export default function CreateTransporteCondicion() {
  const navigate = useNavigate();

  const { mutate,isPending } = useMutation({
    mutationFn: createTransporteCondicion,
    onError: () => {
      toast.error('Hubo un error al crear la condición');
    },
    onSuccess: () => {
      toast.success('Condición creada correctamente');
      navigate('/transporte-boleta/condiciones');
    }
  });
  const { 
    handleSubmit,
    register,
    formState:{errors}  
  } = useForm<DraftTransporteCondicion>();

  const onSubmit = (data : DraftTransporteCondicion) => mutate(data);
  return (
    <>
      <h1 className="font-bold text-4xl">Crear Condición</h1>

      <form className="w-1/2 mx-auto mt-10" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase text-gray-700" htmlFor="name">
            Condición:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder="Condición"
            className="border border-black p-3 "
            {...register('name', { required: 'La condición es requerida' })}
          />
          {errors.name?.message && <Error>{errors.name.message}</Error>}
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
              <p className="font-bold text-lg">Crear Usuario</p>
            )}
          </Button>
      </form>
    </>
  )
}
