//DEPENDENCIAS
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

//ESTADO GLOBAL

//COMPONENTES
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";
import { Button } from "@mui/material";
import Error from "@/components/Error";

//TYPES
import { DraftTarea, Tarea } from "@/types";

import { getTareaById } from "@/api/TasksAPI";
import { updateTarea } from "@/api/TasksAPI";

export default function EditTarea() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [editingTarea, setEditingTarea] = useState<Tarea>({} as Tarea);
  const [loadingGet, setLoadingGet] = useState<boolean>(false);
  const [errorGet, setErrorGet] = useState<boolean>(false);
  const [loadingPost, setLoadingPost] = useState<boolean>(false);

  const handleGetTareaById = async () => {
    setLoadingGet(true);
    setErrorGet(false);
    try {
      if (id) {
        const tarea = await getTareaById(id)
        setEditingTarea(tarea);
        setLoadingGet(false);
      }
    } catch (error) {
      setErrorGet(true);
    }
  }

  const handleUpdateTarea = async (data: DraftTarea) => {
    setLoadingPost(true);
    if (id) {
      const errors = await updateTarea(id, data);
      if (errors) {
        errors.forEach(error => toast.error(error[0]))
        return;
      }
      toast.success("Tarea actualizada correctamente");
      navigate("/tareas");
    }
    setLoadingPost(false);
  }

  useEffect(() => {
    handleGetTareaById();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DraftTarea>();

  useEffect(() => {
    if (editingTarea) {
      setValue("name", editingTarea.name || "");
      setValue("code", editingTarea.code || "");
      setValue("description", editingTarea.description || "");
    }
  }, [editingTarea, setValue]);


  return (
    <>
      {!loadingGet && !errorGet && (
        <>
          <h2 className="text-4xl font-bold">Editar Tarea {editingTarea.name}</h2>
        </>
      )}
      {loadingGet && <Spinner />}

      {!loadingGet && errorGet && <ShowErrorAPI />}

      {!loadingGet && !errorGet && (
        <div>
          <form
            className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
            onSubmit={handleSubmit(handleUpdateTarea)}
          >
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
              disabled={loadingPost}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              {loadingPost ? (
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
