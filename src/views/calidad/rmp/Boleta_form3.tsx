import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { createQualityDoc } from "@/api/ReceptionsDocAPI";
import { useNavigate } from "react-router-dom";
import { DraftDefecto } from "@/components/modals/ModalCrearDefecto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getProductById } from "@/api/ProductsAPI";
import { BoletaRmpDetail, ResultBoletaRmpCalidad } from "@/types/rmpDocTypes";
import { Defect } from "@/types/index";
import SignatureCanvas from "react-signature-canvas";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputComponent from "@/components/form/InputComponent";

type Props = {
  boleta: BoletaRmpDetail
}

export type DraftBoletaControlCalidad = {
  producer_id: string,
  net_weight: number,
  no_doc_cosechero: string,
  sample_units: number,
  total_baskets: number,
  ph: number,
  brix: number,
  percentage: number,
  valid_pounds: number,
  observations: string,
  isMinimunRequire: boolean,
  inspector_signature: string,
}


export default function Boleta_form3({ boleta }: Props) {
  const [defects, setDefects] = useState<DraftDefecto[]>([]);
  const inspector_signature = useRef({} as SignatureCanvas);
  const [results, setResults] = useState<ResultBoletaRmpCalidad[]>([]);
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getDefectsByQualityProduct', boleta.product_id],
    queryFn: () => getProductById(boleta.product_id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createQualityDoc,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/rmp');
    }
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DraftBoletaControlCalidad>();

  useEffect(() => {
    if (boleta) {
      setValue("net_weight", boleta.prod_net_weight ?? 0);
      setValue("total_baskets", boleta.baskets ?? 0);
    }
  }, [boleta, setValue]);

  useEffect(() => {
    setValue("isMinimunRequire", !isMinimunRequire);
    setValue("percentage", percentage * 100);
    setValue("valid_pounds", percentage * (boleta.prod_net_weight ?? 0))
  }, [percentage]);

  useEffect(() => {
    if (data) {
      const initialResults = data.defects.map((defect) => ({
        input: 0,
        id: defect.id.toString(),
        result: 0,
        tolerance_percentage: defect.tolerance_percentage
      }));
      setDefects(data.defects.filter(defect => defect.status));
      setResults(initialResults);
    }
  }, [data]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const defect = defects.find(defect => defect.id === Number(e.target.id));
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
    const result = results.find(result => (result.id === id.toString() && result.result));
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

  const onSubmit = async (data: DraftBoletaControlCalidad) => mutate({ FormData: data, id: boleta.id, results })

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  return (
    <>
      <div>
        <form
          className="mt-10 w-full mx-auto shadow p-10 space-y-5"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-3 gap-5 border p-5">
            <legend className="font-bold text-3xl">Información general</legend>
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

            <InputComponent<DraftBoletaControlCalidad>
              label="Peso Neto"
              id="net_weight"
              name="net_weight"
              placeholder="Peso Neto"
              register={register}
              validation={{ required: 'El peso neto es obligatorio' }}
              errors={errors}
              type={'number'}
            >
              {errors.net_weight && <Error>{errors.net_weight?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="No. Hoja Cosechero"
              id="no_doc_cosechero"
              name="no_doc_cosechero"
              placeholder="Número de hoja de cosechero"
              register={register}
              validation={{}}
              errors={errors}
              type={'text'}
            >
              {errors.no_doc_cosechero && <Error>{errors.no_doc_cosechero?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="Unidades de Muestra"
              id="sample_units"
              name="sample_units"
              placeholder="Unidades de Muestra"
              register={register}
              validation={{ required: 'Las unidades de muestra es obligatoria' }}
              errors={errors}
              type={'text'}
            >
              {errors.sample_units && <Error>{errors.sample_units?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="Cantidad de Canastas"
              id="total_baskets"
              name="total_baskets"
              placeholder="Total de Canastas"
              register={register}
              validation={{ required: 'La cantidad de canastas es obligatoria' }}
              errors={errors}
              type={'number'}
            >
              {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
            </InputComponent>
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
                          <input name={defect.id.toString()} id={defect.id.toString()} type="number" className="border border-black p-0.5" onChange={e => handleInput(e)} />
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

          <fieldset className="grid grid-cols-4 gap-5 border p-5">
            <legend className="font-bold text-3xl">Información Calculada</legend>
            <InputComponent<DraftBoletaControlCalidad>
              label="Libras Pagables"
              id="valid_pounds"
              name="valid_pounds"
              placeholder="Libras Pagables"
              register={register}
              validation={{ required: 'Las libras pagables son obligatorias' }}
              errors={errors}
              type={'number'}
            >
              {errors.valid_pounds && <Error>{errors.valid_pounds?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="% A Pagar"
              id="percentage"
              name="percentage"
              placeholder="Porcentaje a pagar"
              register={register}
              validation={{ requried: 'El porcentaje a pagar es obligatorio' }}
              errors={errors}
              type={'number'}
            >
              {errors.percentage && <Error>{errors.percentage?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="PH"
              id="ph"
              name="ph"
              placeholder="PH"
              register={register}
              validation={{}}
              errors={errors}
              type={'number'}
            >
              {errors.ph && <Error>{errors.ph?.message?.toString()}</Error>}
            </InputComponent>

            <InputComponent<DraftBoletaControlCalidad>
              label="Brix"
              id="brix"
              name="brix"
              placeholder="Datos del brix"
              register={register}
              validation={{}}
              errors={errors}
              type={'number'}
            >
              {errors.brix && <Error>{errors.brix?.message?.toString()}</Error>}
            </InputComponent>
          </fieldset>

          <InputComponent<DraftBoletaControlCalidad>
            label="Observaciones"
            id="observations"
            name="observations"
            placeholder="Observaciones Generales"
            register={register}
            validation={{}}
            errors={errors}
            type={'text'}
          >
            {errors.observations && <Error>{errors.observations?.message?.toString()}</Error>}
          </InputComponent>

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

          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear Boleta</p>}
          </button>
        </form>
      </div >
    </>
  )
}
