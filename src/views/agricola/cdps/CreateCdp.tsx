import { useEffect } from "react";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";

export default function CreateCdp() {
  const fetchCrops = useAppStore((state) => state.fetchCrops);
  const loadingFetchCrops = useAppStore((state) => state.loadingFetchCrop);
  const crops = useAppStore((state) => state.crops);

  useEffect(() => {
    fetchCrops();
  }, []);
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Control de Plantación</h2>
      <ReturnLink url="/cdps" />

      <form action="">
        {loadingFetchCrops ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="role">
              Cultivo:
            </label>

            <select
              id="role"
              className="border border-black p-3"
              // {...register("roles", { required: "El rol es obligatorio" })}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {crops.map((crop) => (
                <option value={crop.name} key={crop.id}>
                  {crop.name} - {crop.variety}
                </option>
              ))}
            </select>

            {/* {errors.roles && <Error>{errors.roles?.message?.toString()}</Error>} */}
          </div>
        )}

        {/* <div className="flex flex-col gap-2">
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
        </div> */}
      </form>
    </>
  );
}
