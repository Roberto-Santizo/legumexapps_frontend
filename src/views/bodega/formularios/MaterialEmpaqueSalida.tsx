import { useForm, Controller } from "react-hook-form";
import { useRef } from "react";
// import { toast } from "react-toastify";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import SignatureCanvas from "react-signature-canvas";

export type DraftWarehouseOutput = {
  quantity: number;
  lote: string;
  date: Date;
  observations: string;
  delivered_by_signature: string;
  received_by_signature: string;
};

export default function WarehouseOutput() {
  const delivered_by_signature = useRef({} as SignatureCanvas);
  const received_by_signature = useRef({} as SignatureCanvas);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<DraftWarehouseOutput>();

  const onSubmit = () => {}

  return (
    <div>
      <h1 className="font-bold text-3xl uppercase">Entrega de material de empaque</h1>
      <form className="w-3/4 mb-10 shadow-xl p-10 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent<DraftWarehouseOutput>
          label="Cantidad"
          id="quantity"
          name="quantity"
          placeholder="Cantidad de material entregado"
          register={register}
          validation={{ required: "La cantidad del es obligatorio" }}
          errors={errors}
          type={"text"}
        >
          {errors.quantity && (
            <Error>{errors.quantity?.message?.toString()}</Error>
          )}
        </InputComponent>

        <InputComponent<DraftWarehouseOutput>
          label="Lote"
          id="lote"
          name="lote"
          placeholder="Ingrese el lote"
          register={register}
          validation={{ required: "El lote es obligatorio" }}
          errors={errors}
          type={"text"}
        >
          {errors.lote && <Error>{errors.lote?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftWarehouseOutput>
          label="Fecha"
          id="date"
          name="date"
          placeholder="Ingrese la fecha"
          register={register}
          validation={{ required: "La fecha es obligatoria" }}
          errors={errors}
          type={"text"}
        >
          {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftWarehouseOutput>
          label="Observaciones"
          id="observations"
          name="observations"
          placeholder="Ingrese la observaciones"
          register={register}
          validation={{}}
          errors={errors}
          type={"text"}
        >
          {errors.observations && (
            <Error>{errors.observations?.message?.toString()}</Error>
          )}
        </InputComponent>

        <div className="flex flex-col md:flex-row justify-center gap-10 w-full">
          <div className="space-y-2 text-center">
            <Controller
              name="delivered_by_signature"
              control={control}
              rules={{ required: "Asegurese de haber firmado" }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={delivered_by_signature}
                    penColor="black"
                    canvasProps={{ className: "w-full h-60 border" }}
                    onEnd={() => {
                      field.onChange(
                        delivered_by_signature.current.toDataURL()
                      );
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                    onClick={() => {
                      delivered_by_signature.current.clear();
                      field.onChange("");
                    }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Firma de quien entrega
            </label>

            {errors.delivered_by_signature && (
              <Error>{"Asegurese de haber firmado"}</Error>
            )}
          </div>

          <div className="space-y-2 text-center">
            <Controller
              name="received_by_signature"
              control={control}
              rules={{ required: "Asegurese de haber firmado" }}
              render={({ field }) => (
                <div className="p-2">
                  <SignatureCanvas
                    ref={received_by_signature}
                    penColor="black"
                    canvasProps={{ className: "w-full h-60 border" }}
                    onEnd={() => {
                      field.onChange(received_by_signature.current.toDataURL());
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded uppercase font-bold"
                    onClick={() => {
                      received_by_signature.current.clear();
                      field.onChange("");
                    }}
                  >
                    Limpiar Firma
                  </button>
                </div>
              )}
            />
            <label className="block font-medium text-xl">
              Firma de quien recibe
            </label>

            {errors.received_by_signature && (
              <Error>{"Asegurese de haber firmado"}</Error>
            )}
          </div>
        </div>

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {/* <Spinner />  */}
          <p>Registrar entrega de material</p>
        </button>
      </form>
    </div>
  );
}
