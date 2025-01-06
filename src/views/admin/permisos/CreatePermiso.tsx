//HOOKS
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";


//TYPES
import { DraftPermssion } from "../../../types";

//COMPONENTES
import { Button } from "@mui/material";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Error from "../../../components/Error";
import Spinner from "../../../components/Spinner";

export default function CreatePermiso() {
  const createPermiso = useAppStore((state) => state.createPermission);
  const permisosErrores = useAppStore((state) => state.permissionsErrors);
  const loadingPermission = useAppStore((state) => state.loadingPermissions);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftPermssion>();

  const RegisterPermission = (data: DraftPermssion) => {
    createPermiso(data)
      .then(() => {
        toast.success("Permiso creado correctamente");
        navigate("/permisos");
      })
      .catch(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Permiso</h2>
      <ReturnLink url="/permisos" />

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(RegisterPermission)}
        >
          {permisosErrores
            ? permisosErrores.map((error, index) => (
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
              placeholder={"Nombre del permiso"}
              className="border border-black p-3"
              {...register("name", { required: "El nombre es obligatorio" })}
            />
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
          </div>

          <Button
            disabled={loadingPermission}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loadingPermission ? (
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
