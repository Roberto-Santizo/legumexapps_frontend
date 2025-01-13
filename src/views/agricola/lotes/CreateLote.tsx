import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";
import { Button } from "@mui/material";

export default function CreateLote() {
  const fetchFincas = useAppStore((state) => state.fetchFincas);
  const loadingFetchFincas = useAppStore((state) => state.loadingFetchFincas);
  const fincas = useAppStore((state) => state.fincas);
  useEffect(() => {
    fetchFincas();
  }, []);
  return (
    <>
      <h2 className="text-4xl font-bold">Crear Lote</h2>
      <form className="w-1/2 mx-auto p-5 space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del lote"}
            className="border border-black p-3"
            // {...register("name", {
            //   required: "El nombre del CDP es obligatorio",
            // })}
          />
          {/* {errors.name && <Error>{errors.name?.message?.toString()}</Error>} */}

          {loadingFetchFincas ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="finca_id">
                Finca:
              </label>

              <select
                id="finca_id"
                className="border border-black p-3"
                //   {...register("finca_id", {
                //     required: "Especifique el cultivo relacionado al CDP",
                //   })}
              >
                <option value="">--SELECCIONE UNA OPCIÓN--</option>
                {fincas.map((finca) => (
                  <option value={finca.id} key={finca.id}>
                    {finca.name}
                  </option>
                ))}
              </select>

              {/* {errors.finca_id && (
              <Error>{errors.finca_id?.message?.toString()}</Error>
            )} */}
            </div>
          )}
        </div>

        <Button
        //   disabled={loadingCreateCDP}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {/* {loadingCreateCDP ? (
            <Spinner />
          ) : ( */}
            <p className="font-bold text-lg">Crear Lote</p>
          {/* )} */}
        </Button>
      </form>
    </>
  );
}
