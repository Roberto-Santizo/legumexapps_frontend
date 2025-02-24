//HOOKS
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createPermission } from "@/api/PermissionsAPI";

//TYPES
import { DraftPermssion } from "@/types";

//COMPONENTES
import { Button } from "@mui/material";
import Error from "@/components/Error";
import Spinner from "@/components/Spinner";
import { useState } from "react";

export default function CreatePermiso() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftPermssion>();

  const handleCreatePermission = async (data: DraftPermssion) => {
    setLoading(true);

    const errors = await createPermission(data);
    if (errors) {
      errors.forEach(error => toast.error(error[0]))
      setLoading(false);
      return;
    }
    toast.success("Permiso creado correctamente");
    navigate("/permisos");
    setLoading(false);
  };


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
              <p className="font-bold text-lg">Crear Permiso</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
