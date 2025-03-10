import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";

export default function CreateSKU() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isPending, setIsPending] = React.useState(false);

  const onSubmit = (data: any) => {
    setIsPending(true);
    toast.success("Línea creada con éxito");
    console.log(data);
    setIsPending(false);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear línea</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="code">
              Código:
            </label>
            <input
              autoComplete="off"
              id="code"
              type="text"
              placeholder="Ingrese el código del SKU"
              className="border border-black p-3"
              {...register("code", { required: "El código del SKU es obligatorio" })}
            />
            {errors.code?.message && <Error>{String(errors.code.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="total_persons">
              Total de personas:
            </label>
            <input
              autoComplete="off"
              id="total_persons"
              type="number"
              placeholder="Ingrese el total de personas"
              className="border border-black p-3"
              {...register("total_persons", { required: "El total de personas es obligatorio" })}
            />
            {errors.total_persons?.message && <Error>{String(errors.total_persons.message)}</Error>}
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
              <p className="font-bold text-lg">Crear Condición</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
