import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export default function CreateSKU() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    toast.success("Línea creada con éxito");
    console.log(data);
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
              {...register("code", { required: "El código es obligatorio" })}
            />
            {errors.code && (
              <p className="text-red-500">{errors.code.message as string}</p>
            )}
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
              {...register("total_persons", {
                required: "El total de personas es obligatorio",
                min: { value: 1, message: "Debe ser al menos 1" },
              })}
            />
            {errors.total_persons && (
              <p className="text-red-500">{errors.total_persons.message as string}</p>
            )}
          </div>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            <p className="font-bold text-lg">Crear línea</p>
          </Button>
        </form>
      </div>
    </>
  );
}
