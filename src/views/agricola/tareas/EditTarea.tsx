//DEPENDENCIAS
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

//ESTADO GLOBAL
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { Button } from "@mui/material";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Error from "../../../components/Error";

//TYPES
import { DraftTarea } from "../../../types";

export default function EditTarea() {
  //FETCH TAREA
  const { id } = useParams();
  const getTarea = useAppStore((state) => state.getTarea);

  //LOADING STATES
  const loadingTarea = useAppStore((state) => state.loadingTareas);
  const loadingUpdateTarea = useAppStore((state) => state.loadingUpdateTarea);

  //ERROR STATES
  const errorGetTarea = useAppStore((state) => state.errorGetTarea);
  const errorUpdateTarea = useAppStore((state) => state.errorUpdateTarea);
  const errorsTareas = useAppStore((state) => state.errorsTareas);

  const tarea = useAppStore((state) => state.editingTarea);
  const update = useAppStore((state) => state.updateTarea);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getTarea(id);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DraftTarea>();

  useEffect(() => {
    if (tarea) {
      setValue("name", tarea.name || "");
      setValue("code", tarea.code || "");
      setValue("description", tarea.description || "");
    }
  }, [tarea, setValue]);

  const updateTarea = (data: DraftTarea) => {
    if (id) {
      update(id, data)
        .then(() => {
          toast.success("Tarea actualizada correctamente");
          navigate("/tareas");
        })
        .catch(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
  };
  return (
    <>
      {!loadingTarea && !errorGetTarea && (
        <>
          <h2 className="text-4xl font-bold">Editar Tarea {tarea.name}</h2>
        </>
      )}
      {loadingTarea && <Spinner />}

      {!loadingTarea && errorGetTarea && <ShowErrorAPI />}

      {!loadingTarea && !errorGetTarea && (
        <div>
          <form
            className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
            onSubmit={handleSubmit(updateTarea)}
          >
            {errorUpdateTarea &&
              (errorsTareas
                ? errorsTareas.map((error, index) => (
                    <Error key={index}>{error}</Error>
                  ))
                : null)}

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
              disabled={loadingUpdateTarea}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loadingUpdateTarea ? (
                <Spinner />
              ) : (
                <p className="font-bold text-lg">Actualizar Tarea</p>
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
