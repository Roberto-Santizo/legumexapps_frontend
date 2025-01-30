//HOOKS
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import Select from "react-select";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import { Button } from "@mui/material";
import { DraftLote, Finca, Plantation } from "../../../types";
import Error from "../../../components/Error";
import { toast } from "react-toastify";

export default function CreateLote() {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loadingGetFincas, setLoadingGetFincas] = useState<boolean>(false);

  const [cdps, setCdps] = useState<Plantation[]>([]);
  const [loadingGetCDPS, setLoadingGetCPS] = useState<boolean>(false);

  const [loadingCreateLote, setLoadingCreateLote] = useState<boolean>(false);

  const fetchFincas = useAppStore((state) => state.fetchFincas);
  const fetchCDPS = useAppStore((state) => state.fetchControlPlantations);

  const errorsCreateLote = useAppStore((state) => state.errorsCreateLote);
  const createLote = useAppStore((state) => state.createLote);
  const navigate = useNavigate();

  const cdpsOptions = cdps.map((cdp) => ({
    value: cdp.id,
    label: cdp.name,
  }));

  const fincasOptions = fincas.map((finca) => ({
    value: finca.id,
    label: finca.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftLote>();

  const handleGetFincas = async () => {
    setLoadingGetFincas(true);
    try {
      const fincas = await fetchFincas();
      setFincas(fincas);
    } catch (error) {
      toast.error("Error al trear fincas, intentelo de nuevo más tarde");
    }
  };

  const handleGetCDPS = async () => {
    setLoadingGetCPS(true);
    try {
      const cdps = await fetchCDPS();
      setCdps(cdps);
    } catch (error) {
      toast.error(
        "Hubo un error al traer los cdps, intentelo de nuevo más tarde"
      );
    } finally {
      setLoadingGetCPS(false);
    }
  };

  const handleCreateLote = async (data: DraftLote) => {
    setLoadingCreateLote(true);
    try {
      await createLote(data);
      toast.success("Lote creado correctamente");
      navigate("/lotes");
    } catch (error) {
        toast.error('Error al crear el lote');
    }finally{
      setLoadingCreateLote(false);
    }
  };

  useEffect(() => {
    handleGetFincas();
    handleGetCDPS();
  }, []);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Lote</h2>
      <form
        className="w-1/2 mx-auto p-5 space-y-5"
        onSubmit={handleSubmit(handleCreateLote)}
      >
        {errorsCreateLote
          ? errorsCreateLote.map((error, index) => (
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
            placeholder={"Nombre del lote"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del Lote es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}

          {loadingGetFincas && loadingGetCDPS ? (
            <Spinner />
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label
                  className="text-lg font-bold uppercase"
                  htmlFor="finca_id"
                >
                  Finca:
                </label>

                <Controller
                  name="finca_id"
                  control={control}
                  rules={{ required: "Seleccione una Finca" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={fincasOptions}
                      id="finca_id"
                      placeholder={"--SELECCIONE UNA OPCION--"}
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={fincasOptions.find(
                        (option) => option.value === field.value
                      )}
                    />
                  )}
                />

                {errors.finca_id && (
                  <Error>{errors.finca_id?.message?.toString()}</Error>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold uppercase" htmlFor="cdp_id">
                  CDP:
                </label>

                <Controller
                  name="cdp_id"
                  control={control}
                  rules={{ required: "Seleccione un CDP" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={cdpsOptions}
                      id="cdp_id"
                      placeholder={"--SELECCIONE UNA OPCION--"}
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={cdpsOptions.find(
                        (option) => option.value === field.value
                      )}
                    />
                  )}
                />

                {errors.cdp_id && (
                  <Error>{errors.cdp_id?.message?.toString()}</Error>
                )}
              </div>
            </>
          )}
        </div>

        <Button
          disabled={loadingCreateLote}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {loadingCreateLote ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Lote</p>
          )}
        </Button>
      </form>
    </>
  );
}
