import { BoletaInfoAll } from "@/types";
import LogoLegumex from "../LogoLegumex";

type Props = {
  boleta: BoletaInfoAll;
}

export default function BoletasCalidad({ boleta }: Props) {
  return (
    <>
      {boleta && (
        <div className="w-full max-w-7xl mx-auto p-8 bg-sky-100 border border-grya-300 mt-10
                    print:w-[297mm] print:h-[210mm] print:max-w-none print:mx-0 print:mt-0 
                    print:bg-white print:p-4 print:shadow-none">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
                <LogoLegumex />
              </div>
              <div className="text-sm">
                <p className="font-medium">AGROINDUSTRIA LEGUMEX, S.A.</p>
                <p>12 Avenida 6-15 Zona 2 Sector</p>
                <p>Las Majadas, El Tejar,</p>
                <p>Chimaltenango, Guatemala</p>
                <p>Teléfono: 7963-0888</p>
              </div>
            </div>

            <div className="text-center flex-1">
              <h1 className="text-xl font-bold">Control De Calidad</h1>
              <h2 className="text-lg">Materia Prima</h2>
              <h3 className="text-xl font-bold">PIÑA</h3>
            </div>

            <div className="text-right">
              <p className="text-right text-base">Planta 1 El Tejar R-CI-RMP-06</p>
              <div className="border border-black p-2">
                <div className="flex justify-between mb-1">
                </div>
                <div className="flex justify-between">
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black mb-6">
            <div className="grid grid-cols-4 divide-x divide-black">
              <div className="col-span-3 border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">NOMBRE PRODUCTOR:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">VARIEDAD:</label>
              </div>

              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">GRN:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">PESO NETO:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">No. HOJA COSECHERO:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">UNIDADES MUESTRA:</label>
              </div>

              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">CANTIDAD DE CANASTAS:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">CODIGO PRODUCTOR:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">PH:</label>
              </div>
              <div className="border-b border-black p-2">
                <label className="text-sm font-medium block mb-1">% A PAGAR:</label>
              </div>

              <div className="p-2">
                <label className="text-sm font-medium block mb-1">BRIX {'>'} 12:</label>
              </div>
              <div className="p-2">
                <label className="text-sm font-medium block mb-1">LIBRAS PAGABLES:</label>
              </div>
              <div className="col-span-2 p-2">
                <label className="text-sm font-medium block mb-1">NOMBRE INSPECTOR CC:</label>
              </div>
            </div>
          </div>

          <div className="border border-black">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black">
                  <th className="p-2 text-left border-r border-black">DEFECTO</th>
                  <th className="p-2 text-center border-r border-black">% DEFECTO</th>
                  <th className="p-2 text-center border-r border-black">% TOLERANCIA ACEPTADO</th>
                  <th className="p-2 text-center">RESULTADO</th>
                </tr>
              </thead>
              <tbody>
                {boleta.quality_doc_data.defects.map((defect, index) => (
                  <tr key={index} className="border-b border-black">
                    <td className="p-2 border-r border-black">{defect.name}</td>
                    <td className="p-2 border-r border-black">{defect.input_percentage} %</td>
                    <td className="p-2 border-r border-black">{defect.tolerace_percentage} %</td>
                    <td className="p-2 border-r border-black">{defect.result}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-black">
                  <td colSpan={2} className="p-2"></td>
                  <td className="p-2 text-right border-r border-black font-bold">TOTAL:</td>
                  <td className="p-2 text-center">{boleta.quality_doc_data.total_defects_evaluation}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-2"></td>
                  <td className="p-2 text-right border-r border-black font-bold">% A PAGAR:</td>
                  <td className="p-2 text-center">{boleta.quality_doc_data.percentage}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Observations */}
          <div className="mt-6">
            <p className="text-sm font-bold mb-2">OBSERVACIONES:</p>
            <p className="p-2 border border-black min-h-[6rem]">{boleta.quality_doc_data.observations}</p>
          </div>


          {/* Bottom Text */}
          <div className="mt-6 text-sm text-center text-gray-600">
            <p>ORIGINAL: Productor • AMARILLO: Administración • CELESTE: Control de Calidad • ROSADO: Agrícola</p>
            <p>Impresos ALFE Antigua G. Tel:5429-5045. Impresos del 36,251 al 38,750. 02/05/2024</p>
          </div>
        </div>
      )}

    </>
  );
}

