import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { DraftProducer } from "../../../types";
import Error from "../../../components/Error";
import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateProducer() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const createProducer = useAppStore((state) => state.createProducer);
  const errorsCreateProductor = useAppStore((state) => state.errorsCreateProductor);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftProducer>();

  const onSubmit = async (data: DraftProducer) => {
    setLoading(true);
    try {
      await createProducer(data);
      toast.success('Productor creado correctamente');
      navigate('/productores');
    } catch (error) {
      toast.error('Hubo un error al crear el productor');
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Productor</h2>

      <div>
        <form className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          {errorsCreateProductor
            ? errorsCreateProductor.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))
            : null}
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
              type="number"
              placeholder="Código del productor"
              className="border border-black p-3"
              {...register('code', { required: 'El codigo del productor es obligatorio' })}
            />
            {errors.code?.message && <Error>{errors.code.message.toString()}</Error>}
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
              <p className="font-bold text-lg">Crear Productor</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
