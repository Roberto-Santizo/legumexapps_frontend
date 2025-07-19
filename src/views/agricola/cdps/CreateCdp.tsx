import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCrops } from "@/api/PlantationControlAPI";
import { getRecipes } from "@/api/PlantationControlAPI";
import { createCDP } from "@/api/PlantationControlAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Crop } from "types/cropTypes";
import { Recipe } from "types/recipeTypes";
import InputSelectComponent from "@/components/form/InputSelectComponent";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";


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

  const cropOptions = crops.map((crop) => ({
    value: crop.id,
    label: `${crop.name} - ${crop.variety}`,
  }));

  const recipeOptions = recipes.map((recipe) => ({
    value: recipe.id,
    label: recipe.name,
  }));


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
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear Control de Plantación</h2>

      <form
        action=""
        className="space-y-5 xl:w-2/3 mx-auto p-5 mt-10"
        onSubmit={handleSubmit(handleCreateCDP)}
      >
        <InputComponent<DraftCDP>
          label="Nombre del CDP"
          id="name"
          name="name"
          placeholder="Nombre del CDP"
          register={register}
          validation={{ required: 'El nombre del CDP es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftCDP>
          label="Densidad"
          id="density"
          name="density"
          placeholder="Densidad de CDP"
          register={register}
          validation={{ required: 'La densidad es obligatoria' }}
          errors={errors}
          type={'number'}
        >
          {errors.density && <Error>{errors.density?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftCDP>
          label="Tamaño"
          id="size"
          name="size"
          placeholder="Tamaño de CDP"
          register={register}
          validation={{
            required: "El tamaño del CDP es obligatorio",
            pattern: {
              value: /^\d{1,3}X\d{1,3}$/,
              message:
                "El formato debe ser númeroXnúmero, por ejemplo: 45X45",
            },
          }}
          errors={errors}
          type={'text'}
        >
          {errors.size && <Error>{errors.size?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftCDP>
          label="Fecha de Inicio del CDP"
          id="start_date"
          name="start_date"
          placeholder=""
          register={register}
          validation={{ required: 'Fecha de inicio del CDP es obligatorio' }}
          errors={errors}
          type={'date'}
        >
          {errors.start_date && <Error>{errors.start_date?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectComponent<DraftCDP>
          label="Cultivo"
          id="crop_id"
          name="crop_id"
          options={cropOptions}
          register={register}
          validation={{ required: 'El cultivo es obligatario' }}
          errors={errors}
        >
          {errors.crop_id && <Error>{errors.crop_id?.message?.toString()}</Error>}
        </InputSelectComponent>

        <InputSelectComponent<DraftCDP>
          label="Receta"
          id="recipe_id"
          name="recipe_id"
          options={recipeOptions}
          register={register}
          validation={{ required: 'La receta es obligatoria' }}
          errors={errors}
        >
          {errors.recipe_id && <Error>{errors.recipe_id?.message?.toString()}</Error>}
        </InputSelectComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear CDP</p>}
        </button>
      </form>
    </>
  );
}
