import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";


import { Button } from "@mui/material";
import { BoletaDetail, Defect, DraftBoletaCalidad,ResultBoletaCalidad } from "@/types";
import { useAppStore } from "@/stores/useAppStore";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import { useNavigate } from "react-router-dom";

type Props = {
  boleta: BoletaDetail
}

export default function Boleta_form3({ boleta }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [defects, setDefects] = useState<Defect[]>([]);
  const inspector_signature = useRef({} as SignatureCanvas);
  const [results, setResults] = useState<ResultBoletaCalidad[]>([]);
  const navigate = useNavigate();

  const total_points = useMemo(() => {
    const total = results.reduce((acc, item) =>
      item.result > 0 ? acc + Number(item.result) : acc
      , 0);
    return total;
  }, [results]);

  const percentage = useMemo(() => {
    return (100 - total_points) / 100;
  }, [total_points]);

  const isMinimunRequire = useMemo(() => {
    return percentage * 100 < boleta.minimun_percentage;
  }, [percentage]);


  const getDefectsByQualityProduct = useAppStore((state) => state.getDefectsByQualityProduct);
  const createQualityDoc = useAppStore((state) => state.createQualityDoc)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DraftBoletaCalidad>();

  const handleGetDefects = async () => {
    setLoading(true);
    try {
      const data = await getDefectsByQualityProduct(boleta.product_id);
      const initialResults = data.map((defect) => ({
        input: 0,
        id: defect.id,
        result: 0,
        tolerance_percentage: defect.tolerance_percentage
      }));
      setDefects(data.filter(defect => defect.status));
      setResults(initialResults);
    } catch (error) {
      toast.error('Hubo un error al traer la información');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (boleta) {
      setValue("net_weight", boleta.net_weight ?? 0);
      setValue("total_baskets", boleta.baskets ?? 0);
    }
  }, [boleta, setValue]);

  useEffect(() => { 
    setValue("isMinimunRequire", !isMinimunRequire);
  }, [percentage]);

  useEffect(() => {
    if (boleta) {
      handleGetDefects();
    }
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const defect = defects.find(defect => defect.id === e.target.id);
    const inputName = e.target.name;

    const existingResultIndex = results.findIndex((value) => value.id === inputName);

    const updateResult = (value: string, tolerance: number) => {
      const result = (+value - tolerance);
      return result;
    };

    if (existingResultIndex !== -1 && defect) {
      setResults((prevResults) => {
        const updatedResults = [...prevResults];
        const result = updateResult(e.target.value, defect.tolerance_percentage);
        updatedResults[existingResultIndex] = { id: inputName, result: result, tolerance_percentage: defect.tolerance_percentage, input: +e.target.value };
        return updatedResults;
      });
    } else if (defect) {
      const result = updateResult(e.target.value, defect.tolerance_percentage);
      setResults((prevResults) => [...prevResults, { id: inputName, result: result, tolerance_percentage: defect.tolerance_percentage, input: +e.target.value }]);
    }
  };

  const handleGetResult = (id: Defect['id']) => {
    const result = results.find(result => (result.id === id && result.result));
    if (result) {
      if (result.result < 0) {
        return 0;
      } else {
        return result.result;
      }
    } else {
      return 0;
    }

  }

  const onSubmit = async (data : DraftBoletaCalidad) => {
    setLoading(true);
    try {
      await createQualityDoc(data, boleta.id, results);
      navigate('/rmp');
      toast.success('Boleta de calidad creada correctamente');
    } catch (error) {
      toast.error('Hubo un error al crear la boleta de calidad');
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <form
          className="mt-10 w-full mx-auto shadow p-10 space-y-5"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase">
                VARIEDAD:
              </label>
              <input
                autoComplete="off"
                disabled
                type="text"
                className="border border-black p-3 opacity-35 cursor-not-allowed"
                value={`${boleta.product} - ${boleta.variety}`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase">
                PORCENTAJE DE CAMPO:
              </label>
              <input
                autoComplete="off"
                disabled
                type="text"
                className="border border-black p-3 opacity-35 cursor-not-allowed"
                value={`${boleta.percentage_field}%`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase">
                PRODUCTOR:
              </label>
              <input
                autoComplete="off"
                disabled
                type="text"
                className="border border-black p-3 opacity-35 cursor-not-allowed"
                value={`${boleta.coordinator} - ${boleta.producer_code}`}
              />
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
              {errors.net_weight && <Error>{errors.net_weight?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="no_doc_cosechero">
                No. Hoja Cosechero:
              </label>
              <input
                autoComplete="off"
                id="no_doc_cosechero"
                type="text"
                placeholder={"No. hoja cosechero"}
                className="border border-black p-3"
                {...register("no_doc_cosechero")}
              />
              {errors.no_doc_cosechero && <Error>{errors.no_doc_cosechero?.message?.toString()}</Error>}
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
                {...register("sample_units", { required: "El numero de unidades Muestra es obligatorio" })}
              />
              {errors.sample_units && <Error>{errors.sample_units?.message?.toString()}</Error>}
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
              {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
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
                          <input name={defect.id} id={defect.id} type="number" className="border border-black p-0.5" onChange={e => handleInput(e)} />
                        </td>
                        <td className="tbody-td">{defect.tolerance_percentage}%</td>
                        <td className="tbody-td">
                          {(handleGetResult(defect.id) <= 0) ? '' : handleGetResult(defect.id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center">
                  <p className="mt-5 font-bold uppercase flex justify-end text-3xl">Total: {total_points}</p>
                  {isMinimunRequire && <AlertCircle className="text-red-600" />}
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="grid grid-cols-4 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="valid_pounds">
                Libras Pagables:
              </label>
              <input
                autoComplete="off"
                id="valid_pounds"
                type="number"
                placeholder={"Libras Pagables"}
                value={percentage * boleta.net_weight}
                className="border border-black p-3"
                {...register("valid_pounds", { required: "El valid_pounds es obligatorio" })}
              />
              {errors.valid_pounds && <Error>{errors.valid_pounds?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="percentage">
                % A Pagar:
              </label>
              <input
                autoComplete="off"
                id="percentage"
                type="number"
                placeholder={"Porcentaje a pagar"}
                value={100 - total_points}
                className="border border-black p-3"
                {...register("percentage", { required: "El percentage a pagar es obligatorio" })}
              />
              {errors.percentage && <Error>{errors.percentage?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="ph">
                PH:
              </label>
              <input
                autoComplete="off"
                id="ph"
                type="number"
                placeholder={"Ph"}
                className="border border-black p-3"
                {...register("ph", { required: "El ph es obligatorio" })}
              />
              {errors.ph && <Error>{errors.ph?.message?.toString()}</Error>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase" htmlFor="brix">
                Brix:
              </label>
              <input
                autoComplete="off"
                id="brix"
                type="number"
                placeholder={"Dato del brix"}
                className="border border-black p-3"
                {...register("brix", { required: "El brix es obligatorio" })}
              />
              {errors.brix && <Error>{errors.brix?.message?.toString()}</Error>}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="observations">
              Observaciones:
            </label>
            <input
              autoComplete="off"
              id="observations"
              type="text"
              placeholder={"Observaciones Generales"}
              className="border border-black p-3"
              {...register("observations")}
            />
          </div>


          <div className="space-y-2 text-center w-1/2 mx-auto">
            <Controller
              name="inspector_signature"
              control={control}
              rules={{ required: 'La firma del productor es obligatoria' }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={inspector_signature}
                    penColor="black"
                    canvasProps={{ className: "w-full h-40 border" }}
                  onEnd={() => {
                    field.onChange(inspector_signature.current.toDataURL());
                  }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                  onClick={() => {
                    inspector_signature.current.clear();
                    field.onChange("");
                  }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Firma Inspector
            </label>
          </div>

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
      </div >
    </>
  )
}
