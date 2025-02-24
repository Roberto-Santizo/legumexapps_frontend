import { BoletaInfoAll } from "@/types";
import LogoLegumex from "../LogoLegumex";
import { useRef } from 'react';

type Props = {
  boleta: BoletaInfoAll;
}

export default function BoletasCalidad({ boleta }: Props) {

  const contentRef = useRef<HTMLDivElement>(null);
  // const reactToPrintFn = useReactToPrint({ contentRef });
  

  

  return (
    <>
      <div ref={contentRef}> {/*Esta es la parte que quiero imprimir */}
        {boleta && (
          <div className="w-full max-w-7xl mx-auto p-8 bg-sky-100 border border-grya-300 mt-10
                    print:w-[297mm] print:h-[210mm] print:max-w-none print:mx-0 print:mt-0 
                    print:bg-white print:p-4 print:shadow-none">

            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6 text-sm md:text-base items-center">
              <div className="flex items-center space-x-2">
                <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
                  <LogoLegumex />
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-xl uppercase">Formato</h1>
                <h2 className="text-lg uppercase">Recepción Materia Prima</h2>
              </div>

              <div className="text-right">
                <p className="text-base">FOR-CI-02</p>
                <p className="text-base">VERSIÓN:01</p>
                <p className="text-base">PÁGINAS 1 DE 1</p>
              </div>
              <div>
                <p className="text-base border border-black my-5 h-10 w-4/12">Correlativo ID</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-2/3">
                <span className="text-bold">Fecha</span>
                <div className="grid grid-cols-4 gap-1 md:gap-0.5 mb-4 md:mb-6 text-sm md:text-base items-center">
                  <div className="border border-black w-10/12 pt-1 pb-5 text-center text-base">Día</div>
                  <div className="border border-black w-10/12 pt-1 pb-5 text-center text-base">Mes</div>
                  <div className="border border-black w-10/12 pt-1 pb-5 text-center text-base">Año</div>
                  <div className="border border-black w-10/12 pt-1 pb-5 text-center text-base">Hora</div>
                </div>
              </div>
            </div>


            <div className="mb-6">
              <div className="grid grid-cols-3 border-t border-black">
                <div className="border-r border-b border-l border-black p-2">
                  <label className="text-base font-bold block mb-1">
                    Producto:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.variety}</span>
                  </label>
                </div>
                <div className="border-r border-b border-black p-2">
                  <label className="text-base font-bold block mb-1">
                    PRODUCTOR:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.producer_name}</span>
                  </label>
                </div>
                <div className="border-r border-b border-black p-2">
                  <label className="text-base font-bold block mb-1">
                    GRN:
                    <span className="p-1 text-center text-sm font-normal">{boleta.grn}</span>
                  </label>
                </div>
                <div className="border-r border-b border-l border-black p-2">
                  <label className="text-base font-bold block mb-1">
                    No. De Canastas:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.total_baskets}</span>
                  </label>
                </div>
                <div className="border-r border-b border-black p-2">
                  <label className="text-base font-bold block mb-1 uppercase">
                    Peso neto:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.net_weight}</span>
                  </label>
                </div>
                <div className="border-r border-b border-black p-2">
                  <label className="text-base font-bold block mb-1 uppercase">
                    Tamaño de la muestra:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.sample_units}</span>
                  </label>
                </div>
                <div className="border-r border-b border-l border-black p-2 col-span-2">
                  <label className="text-base font-bold block mb-1">
                    CODIGO PRODUCTOR:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.producer_code}</span>
                  </label>
                </div>
                <div className="border-r border-b border-black p-2">
                  <label className="text-base font-bold block mb-1">
                    % A PAGAR:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.percentage}</span>
                  </label>
                </div>
                <div className="border-r border-b border-l border-black p-2 col-start-3">
                  <label className="text-base font-bold block mb-1">
                    LIBRAS PAGABLES:
                    <span className="p-1 text-center text-sm font-normal">{boleta.quality_doc_data.valid_pounds}</span>
                  </label>
                </div>
              </div>
            </div>


            <div className="border mb-6 mt-5">
              <table className="w-full">
                <thead>
                  <tr>
                    <td className="w-4/12"></td>
                    <td className="border border-black p-2 text-center uppercase font-bold">LIBRAS</td>
                    <td className="border border-black p-2 text-center font-bold">%</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="w-1/6 border border-black p-2 uppercase font-bold">Peso bruto</td>
                    <td className="border border-black p-2">{boleta.prod_data.gross_weight}</td>
                    <td className="border border-black p-2"></td>
                  </tr>

                  <tr>
                    <td className="w-1/6 border border-black p-2 font-bold">PESO NETO</td>
                    <td className="border border-black p-2">{boleta.quality_doc_data.net_weight}</td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2 font-bold w-2/12 uppercase">Tolerancia</td>
                    <td className="border border-black p-2 font-bold w-2/12 uppercase">Resultado</td>
                  </tr>

                  {/* {boleta.quality_doc_data.defects.map((defect, index) => (
                    <tr key={index}>
                      <td className="w-1/6 border border-black p-2">{defect.name.toUpperCase()}</td>
                      <td className="border border-black p-2">{defect.pounds || ''}</td>
                      <td className="border border-black p-2">{defect.percentage || ''}</td>
                      <td className="border border-black p-2 text-center">{defect.tolerace_percentage}%</td>
                      <td className="border border-black p-2 text-center">{defect.result}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>


            <div className="mt-6">
              <p className="text-sm font-bold mb-2">OBSERVACIONES:</p>
              <p className="p-2 border border-black min-h-[6rem]">{boleta.quality_doc_data.observations}</p>
            </div>

            <div className="text-center">
              <div className="border-b border-black h-16 md:h-20 flex items-center justify-center my-6 mx-auto w-6/12">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${boleta.quality_doc_data.inspector_planta_signaure}`}
                  alt="Firma Inspector Planta"
                  className="max-h-20 md:max-h-20 object-contain"
                />
              </div>
              <p className="mt-2">NOMBRE INSPECTOR PLANTA</p>
            </div>

            <div className="mt-6 text-sm text-center text-gray-600">
              <p>Aprobado GCC</p>
              <p>FOR-CI-02. Agroindustria Legumex, Chimaltenango Guatemala. FEBRERO 2025</p>
            </div>
          </div>
        )}
      </div>{/*Aca finaliza el div que voy a imprimir*/}
    </>
  );
}