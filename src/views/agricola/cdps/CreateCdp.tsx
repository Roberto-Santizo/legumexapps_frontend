import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Crop, getCrops, Recipe } from "@/api/PlantationControlAPI";
import { getRecipes } from "@/api/PlantationControlAPI";
import { createCDP } from "@/api/PlantationControlAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

export type DraftCDP = {
  crop_id: string,
  id: string,
  name: string,
  recipe_id: string,
  density: number,
  start_date: string,
  end_date: string | null,
  size: string
}

export default function CreateCdp() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createCDP,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/cdps');
    }
  });

  const results = useQueries({
    queries: [
      { queryKey: ['getCrops'], queryFn: getCrops },
      { queryKey: ['getRecipes'], queryFn: getRecipes },
    ]
  });

  useEffect(() => {
    if (results) {
      if (results[0].data) setCrops(results[0].data);
      if (results[1].data) setRecipes(results[1].data);
    }
  }, [results]);

  const isLoading = results.some(result => result.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftCDP>();

  const handleCreateCDP = async (data: DraftCDP) => mutate(data);

  if (isLoading) return <Spinner />;
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Control de Plantación</h2>

      <form
        action=""
        className="space-y-5 w-2/3 mx-auto p-5 mt-10"
        onSubmit={handleSubmit(handleCreateCDP)}
      >
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del CDP"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del CDP es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="density">
            Densidad:
          </label>
          <input
            autoComplete="off"
            id="density"
            type="number"
            placeholder={"Densidad del CDP"}
            className="border border-black p-3"
            {...register("density", {
              required: "El densidad es obligatoria",
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: "Debe ser un número válido",
              },
            })}
          />
          {errors.density && (
            <Error>{errors.density?.message?.toString()}</Error>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="size">
            Tamaño:
          </label>
          <input
            autoComplete="off"
            id="size"
            type="text"
            placeholder={"Tamaño del CDP"}
            className="border border-black p-3"
            {...register("size", {
              required: "El tamaño del CDP es obligatorio",
              pattern: {
                value: /^\d{1,3}X\d{1,3}$/,
                message:
                  "El formato debe ser númeroXnúmero, por ejemplo: 45X45",
              },
            })}
          />
          {errors.size && <Error>{errors.size?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="start_date">
            Fecha de Incio del CDP:
          </label>
          <input
            autoComplete="off"
            id="start_date"
            type="date"
            className="border border-black p-3"
            {...register("start_date", {
              required: "La fecha de incio del CDP es obligatoria",
            })}
          />
          {errors.start_date && (
            <Error>{errors.start_date?.message?.toString()}</Error>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="crop">
            Cultivo:
          </label>

          <select
            id="crop"
            className="border border-black p-3"
            {...register("crop_id", {
              required: "Especifique el cultivo relacionado al CDP",
            })}
          >
            <option value="">--SELECCIONE UNA OPCIÓN--</option>
            {crops.map((crop) => (
              <option value={crop.id} key={crop.id}>
                {crop.name} - {crop.variety}
              </option>
            ))}
          </select>

          {errors.crop_id && (
            <Error>{errors.crop_id?.message?.toString()}</Error>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="recipe">
            Receta:
          </label>

          <select
            id="recipe"
            className="border border-black p-3"
            {...register("recipe_id", {
              required: "Especifique la receta relacionada al CDP",
            })}
          >
            <option value="">--SELECCIONE UNA OPCIÓN--</option>
            {recipes.map((recipe) => (
              <option value={recipe.id} key={recipe.id}>
                {recipe.name}
              </option>
            ))}
          </select>

          {errors.recipe_id && (
            <Error>{errors.recipe_id?.message?.toString()}</Error>
          )}
        </div>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear CDP</p>}
        </button>
      </form>
    </>
  );
}
