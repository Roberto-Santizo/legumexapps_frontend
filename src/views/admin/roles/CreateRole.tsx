import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { DraftRole } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";
import Error from "../../../components/Error";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import { useState } from "react";

export default function CreateRole() {
  const [loading,setLoading] = useState<boolean>(false);

  const createUser = useAppStore((state) => state.createRole);
  const roleErrores = useAppStore((state) => state.rolesErrors);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftRole>();

  const handleCreateRole = async (data: DraftRole) => {
    setLoading(true);
    try {
      await createUser(data);
      toast.success("Usuario creado correctamente");
      navigate("/roles");
    } catch (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error('Hubo un error al crear el rol, intentelo de nuevo más tarde');
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Rol</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(handleCreateRole)}
        >
          {roleErrores
            ? roleErrores.map((error, index) => (
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
              placeholder={"Nombre del rol"}
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
              <p className="font-bold text-lg">Crear Rol</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
