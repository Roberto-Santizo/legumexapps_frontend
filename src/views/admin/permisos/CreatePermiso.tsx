import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPermission } from "@/api/PermissionsAPI";
import { DraftPermssion } from "@/types";
import { Button } from "@mui/material";
import Error from "@/components/Error";
import Spinner from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

export default function CreatePermiso() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createPermission,
    onError: () => {
      toast.error('Hubo un error al crear el permiso')
    },
    onSuccess: () => {
      toast.success("Permiso creado correctamente");
      navigate("/permisos");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftPermssion>();

  const handleCreatePermission = async (data: DraftPermssion) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Permiso</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(handleCreatePermission)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
              Nombre:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              placeholder={"Nombre del permiso"}
              className="border border-black p-3"
              {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
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
              <p className="font-bold text-lg">Crear Permiso</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
