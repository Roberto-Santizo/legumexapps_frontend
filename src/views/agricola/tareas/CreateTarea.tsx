//HOOKS
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import { Button } from "@mui/material";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Spinner from "../../../components/Spinner";
import Error from "../../../components/Error";
import { useForm } from "react-hook-form";
import { DraftTarea } from "../../../types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateTarea() {
  const loadingTareas = useAppStore((state) => state.loadingTareas);
  const errorsTareas = useAppStore((state) => state.errorsTareas);
  const createTarea = useAppStore((state) => state.createTarea);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftTarea>();

  const RegisterTarea = (data: DraftTarea) => {
    createTarea(data)
      .then(() => {
        toast.success("Tarea creada correctamente");
        navigate("/tareas");
      })
      .catch(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Tarea</h2>
      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        onSubmit={handleSubmit(RegisterTarea)}
      >
        {errorsTareas
          ? errorsTareas.map((error, index) => (
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
            placeholder={"Nombre de la tarea"}
            className="border border-black p-3"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="code">
            Codigo:
          </label>
          <input
            autoComplete="off"
            id="code"
            type="text"
            placeholder={"Codigo de la tarea"}
            className="border border-black p-3"
            {...register("code", { required: "El codigo es obligatorio" })}
          />
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Descripción:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Descripción de la tarea"}
            className="border border-black p-3"
            {...register("description", {
              required: "La descripción es obligatorio",
            })}
          />
          {errors.description && (
            <Error>{errors.description?.message?.toString()}</Error>
          )}
        </div>

        <Button
          disabled={loadingTareas}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {loadingTareas ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Tarea</p>
          )}
        </Button>
      </form>
    </>
  );
}
