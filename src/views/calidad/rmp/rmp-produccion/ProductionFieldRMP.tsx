import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";

import Error from "../../../../components/Error";

export default function ProductionFieldRMP() {
  const {
    register,
    formState: { errors },
  } = useForm();

  const sigCanvasInspector = useRef<SignatureCanvas | null>(null);
  const sigCanvasProductor = useRef<SignatureCanvas | null>(null);

  const [firmasValidas, setFirmasValidas] = useState({
    inspector: false,
    productor: false,
  });

  const handleFirmaEnd = (role: "inspector" | "productor") => {
    setFirmasValidas((prev) => ({ ...prev, [role]: true }));
  };

  const limpiarFirma = (role: "inspector" | "productor") => {
    if (role === "inspector" && sigCanvasInspector.current) {
      sigCanvasInspector.current.clear();
    } else if (role === "productor" && sigCanvasProductor.current) {
      sigCanvasProductor.current.clear();
    }
    setFirmasValidas((prev) => ({ ...prev, [role]: false }));
  };

  return (
    <>
      <h2 className="text-4xl font-bold">
        Crear Boleta Recepción de Materia Prima
      </h2>

      <div>
        <form className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold uppercase"
              htmlFor="total_baskets"
            >
              Cantidad de Canastas:
            </label>
            <input
              autoComplete="off"
              id="total_baskets"
              type="number"
              placeholder="Cantidad de Canastas"
              className="border border-black p-3"
              {...register("total_baskets", {
                required: "La cantidad de canastas es obligatoria",
              })}
            />
            {errors.total_baskets && (
              <Error>{errors.total_baskets?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="weight_basket">
              Peso por Canasta:
            </label>
            <input
              autoComplete="off"
              id="weight_basket"
              type="number"
              placeholder="Peso por canasta"
              className="border border-black p-3"
              {...register("weight_basket", {
                required: "El peso por canasta es obligatorio",
              })}
            />
            {errors.weight_basket && (
              <Error>{errors.weight_basket?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="weight">
              Peso Bruto:
            </label>
            <input
              autoComplete="off"
              id="weight"
              type="text"
              placeholder="Peso bruto del producto"
              className="border border-black p-3"
              {...register("weight", {
                required: "El peso bruto es obligatorio",
              })}
            />
            {errors.weight && (
              <Error>{errors.weight?.message?.toString()}</Error>
            )}
          </div>

          {/* Firma Productor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Firma Productor
              {firmasValidas.productor && (
                <span className="ml-2 text-xs text-green-600">✓ Firmado</span>
              )}
            </label>
            
            <div className="relative">
              <SignatureCanvas
                ref={sigCanvasProductor}
                penColor="black"
                canvasProps={{
                    id: "signature",
                  className:
                    "border border-gray-500 rounded-md w-full h-40 bg-white",
                }}
                onEnd={() => handleFirmaEnd("productor")}
              />
              <button
                type="button"
                onClick={() => limpiarFirma("productor")}
                className="absolute px-2 py-1 bg-white border rounded top-2 right-2 hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <p className="font-bold text-lg">Crear Boleta Producción</p>
          </Button>
        </form>
      </div>
    </>
  );
}
