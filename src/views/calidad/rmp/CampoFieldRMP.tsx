import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from 'react';

import Error from "../../../components/Error";

export default function CampoFieldRMP() {
  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm();

  const sigCanvasInspector = useRef<SignatureCanvas | null>(null);
  const sigCanvasProductor = useRef<SignatureCanvas | null>(null);

  // const [mostrarErrorFirmas, setMostrarErrorFirmas] = useState({
  //   inspector: false,
  //   productor: false,
  // });

  const [firmasValidas, setFirmasValidas] = useState({
    inspector: false,
    productor: false,
  });

  // const [loading, setLoading] = useState(false);
  // const [roleErrores, setRoleErrores] = useState<string[]>([]); // Asegurando que roleErrores esté definido

  // const handleCreateRole = async (data: DraftRole) => {
  //   setLoading(true);
  //   try {
  //     await createUser(data); // Suponiendo que createUser es una función definida en tu app
  //     toast.success("Boleta Creada Correctamente");
  //     navigate("/roles"); // Suponiendo que navigate es un hook de enrutamiento como useNavigate()
  //   } catch (error) {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //     toast.error('Hubo un error al crear la boleta, intentelo de nuevo más tarde');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFirmaEnd = (role: "inspector" | "productor") => {
    if (role === "inspector") {
      setFirmasValidas((prev) => ({ ...prev, inspector: true }));
    } else {
      setFirmasValidas((prev) => ({ ...prev, productor: true }));
    }
  };

  const limpiarFirma = (role: "inspector" | "productor") => {
    if (role === "inspector" && sigCanvasInspector.current) {
      sigCanvasInspector.current.clear();
      setFirmasValidas((prev) => ({ ...prev, inspector: false }));
    } else if (role === "productor" && sigCanvasProductor.current) {
      sigCanvasProductor.current.clear();
      setFirmasValidas((prev) => ({ ...prev, productor: false }));
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Boleta de Recepcion de Materia Prima </h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          // onSubmit={handleSubmit(handleCreateRole)}
        >
          {/* {roleErrores.length > 0
            ? roleErrores.map((error, index) => (
              <Error key={index}>{error}</Error>
            ))
            : null} */}

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="coordinador">
              Coordinador:
            </label>
            <input
              autoComplete="off"
              id="coordinador"
              type="text"
              placeholder={"Nombre del la empresa"}
              className="border border-black p-3"
              {...register("coordinador", { required: "El coordinador es obligatorio" })}
            />
            {errors.coordinador && <Error>{errors.coordinador?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="coordinador">
              Producto:
            </label>
            <select
              id="coordinador"
              className="border border-black p-3"
              {...register("coordinador", { required: "El producto es obligatorio" })}
            >
              <option value="">Selecciona un producto</option>
              <option value="producto1">Producto 1</option>
              <option value="producto2">Producto 2</option>
              <option value="producto3">Producto 3</option>
              {/* Agrega más opciones aquí según tus necesidades */}
            </select>
            {errors.coordinador && <Error>{errors.coordinador?.message?.toString()}</Error>}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="transporte">
              Transporte:
            </label>
            <input
              autoComplete="off"
              id="transporte"
              type="text"
              placeholder={"Nombre de la empresa de transporte"}
              className="border border-black p-3"
              {...register("transporte", { required: "El transporte es obligatorio" })}
            />
            {errors.transporte && <Error>{errors.transporte?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="piloto">
              Nombre Piloto:
            </label>
            <input
              autoComplete="off"
              id="piloto"
              type="text"
              placeholder={"Nombre del piloto"}
              className="border border-black p-3"
              {...register("piloto", { required: "El nombre del piloto es obligatorio" })}
            />
            {errors.piloto && <Error>{errors.piloto?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="inspector">
              Nombre Inspector:
            </label>
            <input
              autoComplete="off"
              id="inspector"
              type="text"
              placeholder={"Nombre del inspector"}
              className="border border-black p-3"
              {...register("inspector", { required: "El nombre del inspector es obligatorio" })}
            />
            {errors.inspector && <Error>{errors.inspector?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="fecha">
              Fecha:
            </label>
            <input
              autoComplete="off"
              id="fecha"
              type="date"
              className="border border-black p-3"
              {...register("fecha", { required: "La fecha es obligatoria" })}
            />
            {errors.fecha && <Error>{errors.fecha?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="cdp">
              CDP:
            </label>
            <input
              autoComplete="off"
              id="cdp"
              type="text"
              placeholder={"Codigo cdp"}
              className="border border-black p-3"
              {...register("cdp", { required: "El CDP es obligatorio" })}
            />
            {errors.cdp && <Error>{errors.cdp?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="placa">
              Placa del transporte:
            </label>
            <input
              autoComplete="off"
              id="placa"
              type="text"
              placeholder={"Numero de placa"}
              className="border border-black p-3"
              {...register("placa", { required: "La placa es obligatoria" })}
            />
            {errors.placa && <Error>{errors.placa?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="pesoBruto">
              Peso Bruto:
            </label>
            <input
              autoComplete="off"
              id="pesoBruto"
              type="number"
              placeholder={"Peso bruto"}
              className="border border-black p-3"
              {...register("pesoBruto", { required: "El peso bruto es obligatorio" })}
            />
            {errors.pesoBruto && <Error>{errors.pesoBruto?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="cantidadCanastas">
              Cantidad de Canastas:
            </label>
            <input
              autoComplete="off"
              id="cantidadCanastas"
              type="number"
              placeholder={"Cantidad de canastas"}
              className="border border-black p-3"
              {...register("cantidadCanastas", { required: "La cantidad de canastas es obligatoria" })}
            />
            {errors.cantidadCanastas && <Error>{errors.cantidadCanastas?.message?.toString()}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="calidad">
              % De Calidad:
            </label>
            <input
              autoComplete="off"
              id="calidad"
              type="number"
              placeholder={"Porcentaje de calidad"}
              className="border border-black p-3"
              {...register("calidad", { required: "El porcentaje de calidad es obligatorio" })}
            />
            {errors.calidad && <Error>{errors.calidad?.message?.toString()}</Error>}
          </div>

          {/* Firmas */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Firma Inspector agrícola
              {firmasValidas.inspector && (
                <span className="ml-2 text-xs text-green-600">✓ Firmado</span>
              )}
            </label>
            <div className="relative">
              <SignatureCanvas
                ref={sigCanvasInspector}
                penColor="black"
                canvasProps={{
                  className: 'border border-gray-500 rounded-md w-full h-40 bg-white'
                }}
                onEnd={() => handleFirmaEnd('inspector')}
              />
              <button
                type="button"
                onClick={() => limpiarFirma('inspector')}
                className="absolute px-2 py-1 bg-white border rounded top-2 right-2 hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>
            {/* {mostrarErrorFirmas.inspector && (
              <Error>La firma del inspector es obligatoria</Error>
            )} */}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Firma del productor
              {firmasValidas.productor && (
                <span className="ml-2 text-xs text-green-600">✓ Firmado</span>
              )}
            </label>
            <div className="relative">
              <SignatureCanvas
                ref={sigCanvasProductor}
                penColor="black"
                canvasProps={{
                  className: 'border border-gray-500 rounded-md w-full h-40 bg-white'
                }}
                onEnd={() => handleFirmaEnd('productor')}
              />
              <button
                type="button"
                onClick={() => limpiarFirma('productor')}
                className="absolute px-2 py-1 bg-white border rounded top-2 right-2 hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>
            {/* {mostrarErrorFirmas.productor && (
              <Error>La firma del productor es obligatoria</Error>
            )} */}
          </div>

          <Button
            // disabled={loading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {/* {loading ? ( */}
              {/* <Spinner />
            ) : ( */}
              <p className="font-bold text-lg">Crear Boleta</p>
            {/* )} */}
          </Button>
        </form>
      </div>
    </>
  );
}
