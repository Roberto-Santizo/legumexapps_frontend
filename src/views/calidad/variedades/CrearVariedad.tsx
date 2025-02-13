
import { Button } from "@mui/material";
import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { useForm } from "react-hook-form";
import { DraftQualityVariety } from "../../../types";
import Error from "../../../components/Error";
import { toast } from "react-toastify";
import { useAppStore } from "../../../stores/useAppStore";
import { useNavigate } from "react-router-dom";

export default function CrearVariedad() {
  const [loading, setLoading] = useState<boolean>();
  const createCalidadVariedad = useAppStore((state) => state.createCalidadVariedad)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftQualityVariety>();

  const onSubmit = async (data: DraftQualityVariety) => {
    setLoading(true);
    try {
      await createCalidadVariedad(data);
      toast.success('Variedad creada correctamente');
      navigate('/variedades');
    } catch (error) {
      toast.error('Hubo un error al crear la variedad, intentelo de nuevo más tarde')
    }finally{
      setLoading(false);
    }
  }
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Variedad</h2>

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
              placeholder="Nombre de la Variedad"
              className="border border-black p-3"
              {...register('name', {
                required: 'El nombre de la variedad es obligatorio'
              })}
            />
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
          </div>

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Variedad</p>
            )}
          </Button>
        </form>
      </div>
    </>
  )
}
