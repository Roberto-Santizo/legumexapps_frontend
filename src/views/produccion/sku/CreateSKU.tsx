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
    toast.success("SKU creado con éxito");
    console.log(data);
    setIsPending(false);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear SKU</h2>

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
            <label className="text-lg font-bold uppercase" htmlFor="name">
              Nombre:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              placeholder="Ingrese el nombre del SKU"
              className="border border-black p-3"
              {...register("name", { required: "El nombre del SKU obligatorio" })}
            />
            {errors.name?.message && <Error>{String(errors.name.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="unit_mesurment">
              Unidad de medida:
            </label>
            <input
              autoComplete="off"
              id="unit_mesurment"
              type="text"
              placeholder="Ingrese la unidad de medida del SKU"
              className="border border-black p-3"
              {...register("unit_mesurment", { required: "La unidad de medida es obligatoria" })}
            />
            {errors.unit_mesurment?.message && <Error>{String(errors.unit_mesurment.message)}</Error>}
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
              <p className="font-bold text-lg">Crear SKU</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}