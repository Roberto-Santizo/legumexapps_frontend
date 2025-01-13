import { useEffect } from "react";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { DraftCDP } from "../../../types";
import Error from "../../../components/Error";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateCdp() {
  const fetchCrops = useAppStore((state) => state.fetchCrops);
  const fetchRecipes = useAppStore((state) => state.fetchRecipes);
  const loadingFetchCrops = useAppStore((state) => state.loadingFetchCrop);
  const loadingFetchRecipes = useAppStore((state) => state.loadingFetchRecipes);
  const loadingCreateCDP = useAppStore((state) => state.loadingCreateCDP);
  const crops = useAppStore((state) => state.crops);
  const recipes = useAppStore((state) => state.recipes);
  const create = useAppStore((state) => state.createControlPlantation);
  const navigate = useNavigate();
  const errorsCreateCDP = useAppStore((state) => state.errorsCreateCDP);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftCDP>();

  useEffect(() => {
    fetchCrops();
    fetchRecipes();
  }, []);

  const createCDP = (data: DraftCDP) => {
    create(data)
      .then(() => {
        navigate("/cdps");
        toast.success("Control de Plantación creado exitosamente");
      })
      .catch(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Control de Plantación</h2>
      <ReturnLink url="/cdps" />

      <form
        action=""
        className="space-y-5 w-2/3 mx-auto p-5"
        onSubmit={handleSubmit(createCDP)}
      >
        {errorsCreateCDP
          ? errorsCreateCDP.map((error, index) => (
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

        {loadingFetchCrops && loadingFetchRecipes ? (
          <Spinner />
        ) : (
          <>
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
          </>
        )}

        <Button
          disabled={loadingCreateCDP}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {loadingCreateCDP ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Control de Plantación</p>
          )}
        </Button>
      </form>
    </>
  );
}
