import { Button } from "@mui/material";
import { BoletaDetail, Defect, QualityVariety } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Spinner from "../../../components/Spinner";

type Props = {
  boleta: BoletaDetail
}

export default function Boleta_form3({ boleta }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [varieties, setVarieties] = useState<QualityVariety[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);

  const varietiesOptions = varieties.map((variety) => ({
    value: variety.id,
    label: variety.name,
  }));

  const getAllVarieties = useAppStore((state) => state.getAllVarieties);
  const getDefectsByQualityVarietyId = useAppStore((state) => state.getDefectsByQualityVarietyId)
  const {
    register,
    // handleSubmit,
    control,
    setValue,
    // formState: { errors },
  } = useForm();

  const handleGetInfo = async () => {
    try {
      const data = await getAllVarieties();
      setVarieties(data);
    } catch (error) {
      toast.error('Hubo un error al traer la información');
    } finally {
      setLoading(false);
    }
  }

  const handleGetDefects = async (value: string) => {
    setLoading(true);
    try {
      const data = await getDefectsByQualityVarietyId(value);
      setDefects(data);
    } catch (error) {
      toast.error('Hubo un error al traer la información');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (boleta) {
      setValue("net_weight", boleta.net_weight);
      setValue("total_baskets", boleta.baskets);
    }
  }, [boleta, setValue]);

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <>
      <div>
        <form
          className="mt-10 w-full mx-auto shadow p-10 space-y-5"
          noValidate
        >
          <fieldset className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="n_boleta">
                No. Boleta:
              </label>
              <input
                autoComplete="off"
                id="n_boleta"
                type="number"
                placeholder={"Numero de Boleta"}
                className="border border-black p-3"
              // {...register("n_boleta", { required: "El numero de boleta es obligatorio" })}
              />
              {/* {errors.n_boleta && <Error>{errors.n_boleta?.message?.toString()}</Error>} */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="quality_variety_id">
                VARIEDAD:
              </label>
              <Controller
                name="quality_variety_id"
                control={control}
                rules={{ required: "Seleccione un tipo de varidedad" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={varietiesOptions}
                    id="quality_variety_id"
                    placeholder={"--SELECCIONE UNA OPCION--"}
                    className="border border-black"
                    onChange={(selected) => {
                      const value = selected?.value;
                      field.onChange(value);
                      if (value !== undefined) {
                        handleGetDefects(value);
                      }
                    }}
                    value={varietiesOptions.find(
                      (option) => option.value === field.value
                    )}
                  />
                )}
              />
              {/* {errors.quality_variety_id && <Error>{errors.quality_variety_id?.message?.toString()}</Error>} */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="net_weight">
                Peso Neto:
              </label>
              <input
                autoComplete="off"
                id="net_weight"
                type="number"
                placeholder={"Peso Neto"}
                className="border border-black p-3"
                {...register("net_weight", { required: "El peso neto es obligatorio" })}
              />
              {/* {errors.net_weight && <Error>{errors.net_weight?.message?.toString()}</Error>} */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="no_doc_cosechero">
                No. Hoja Cosechero:
              </label>
              <input
                autoComplete="off"
                id="no_doc_cosechero"
                type="text"
                placeholder={"Fecha"}
                className="border border-black p-3"
              // {...register("no_doc_cosechero", { required: "El No. Hoja Cosechero es obligatorio" })}
              />
              {/* {errors.no_doc_cosechero && <Error>{errors.no_doc_cosechero?.message?.toString()}</Error>} */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="sample_units">
                Unidades Muestra:
              </label>
              <input
                autoComplete="off"
                id="sample_units"
                type="text"
                placeholder={"Unidades Muestra"}
                className="border border-black p-3"
              // {...register("sample_units", { required: "El numero de unidades Muestra es obligatorio" })}
              />
              {/* {errors.sample_units && <Error>{errors.sample_units?.message?.toString()}</Error>} */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="total_baskets">
                Cantidad de Canastas:
              </label>
              <input
                autoComplete="off"
                id="total_baskets"
                type="number"
                placeholder={"Total de Canastas"}
                className="border border-black p-3"
                {...register("total_baskets", { required: "El total de canastas es obligatorio" })}
              />
              {/* {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>} */}
            </div>
          </fieldset>

          <fieldset>
            {defects.length === 0 ? <p className="text-center font-bold uppercase">No existen criterios de validación para esta variedad</p> : (
              <div className="p-2 overflow-y-auto mt-10">
                <table className="table">
                  <thead>
                    <tr className="thead-tr">
                      <th scope="col" className="thead-th">Defecto</th>
                      <th scope="col" className="thead-th">% Defecto</th>
                      <th scope="col" className="thead-th">% Tolerancia Aceptado</th>
                      <th scope="col" className="thead-th">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defects.map(defect => (
                      <tr className="tbody-tr" key={defect.id}>
                        <td className="tbody-td font-bold">{defect.name}</td>
                        <td className="tbody-td">
                          <input type="number" className="border border-black p-0.5" />
                        </td>
                        <td className="tbody-td">{defect.tolerance_percentage}%</td>
                        <td className="tbody-td">

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </fieldset>

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loading ? <Spinner /> : (
              <p className="font-bold text-lg">Crear Boleta de Calidad</p>
            )}
          </Button>
        </form>
      </div>
    </>
  )
}
