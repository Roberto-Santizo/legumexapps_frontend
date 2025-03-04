import { BoletaInfoAll } from "@/types";
import LogoLegumex from "../LogoLegumex";
import { AlertCircle, CheckCircle } from "lucide-react";
import DownloadPDF from './DownloadPDF';

type Props = {
  boleta: BoletaInfoAll
}

const BoletaCampoRMP = ({ boleta }: Props) => {
  return (
    <div>
      <div className="flex justify-end">
        <div className="p-4 inline-block bg-indigo-500 hover:bg-indigo-600 button">
          <DownloadPDF
            boleta={boleta}
            buttonClassName="text-white"
          />
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-yellow-100 border border-gray-300 mt-4 md:mt-8 lg:mt-10 ">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
              <LogoLegumex />
            </div>
            <div className="text-sm">
              <p>Agroindustria Legumex,</p>
              <p>Chimaltenango Guatemala</p>
              <p>PBX: 7963-0888 FAX: 7937-5005</p>
            </div>
          </div>

          <div className="text-center flex-1 mx-4 md:mx-8">
            <h1 className="text-xl md:text-2xl font-bold">RECIBO DE MATERIA PRIMA</h1>
            <div className="flex justify-center mb-1">
              <span className="p-1 text-center text-2xl font-bold text-red-600">No.{boleta.field_data.id}</span>
            </div>
          </div>

          <div className="text-right text-sm md:text-base">
            <p>R-PRO-MP-02</p>
            <p className="flex justify-between gap-2 md:gap-4">
              <span>GRN No.</span>
              <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right">{boleta.grn}</span>
            </p>
            <p className="flex justify-between gap-2 md:gap-4">
              <span>FECHA</span>
              <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right">{boleta.field_data.doc_date}</span>
            </p>
            <p className="flex justify-between gap-2 md:gap-4">
              <span>C.D.P.</span>
              <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right">{boleta.field_data.cdp}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6 text-sm md:text-base">
          <div className="flex space-x-2">
            <span>PLANTA CONGELADORA</span>
          </div>
          <div className="flex space-x-2">
            <span>TRANSP:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.transport}</span>
          </div>
          <div className="flex space-x-2">
            <span>PILOTO:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.pilot_name}</span>
          </div>
          <div className="flex space-x-2">
            <span>FINCA:</span>
            <span className="border-b border-black flex-grow">{boleta.finca}</span>
          </div>
          <div className="flex space-x-2">
            <span className="uppercase">Productor:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.coordinator}</span>
          </div>
          <div className="flex space-x-2">
            <span>PLACA:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.plate}</span>
          </div>
          <div className="flex space-x-2">
            <span>PRODUCTO:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.product}</span>
          </div>
          <div className="flex space-x-2">
            <span>INSPECT:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.inspector}</span>
          </div>
          <div className="flex space-x-2 col-span-2 md:col-span-3">
            <span>VARIEDAD PRODUCTO:</span>
            <span className="border-b border-black flex-grow">{boleta.field_data.variety}</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="border border-black p-6 col-span-12 md:col-span-6 bg-yellow-100">
            <p className="text-center font-bold mb-8 text-lg uppercase">Datos Campo</p>
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="w-1/3"><span className="font-bold">A.</span> PESO BRUTO</span>
                <div className="flex-1 flex justify-end">
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center">
                      {boleta.field_data.gross_weight}
                    </span>
                    <p className="text-xs mt-0.5">PESO BRUTO</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <span className="w-1/3"><span className="font-bold">B.</span> TARA</span>
                <div className="flex-1 flex items-center justify-end space-x-3">
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.field_data.total_baskets}
                    </span>
                    <p className="text-xs mt-0.5">CANTIDAD DE CANASTAS</p>
                  </div>
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.field_data.weight_basket}
                    </span>
                    <p className="text-xs mt-0.5">X PESO POR CANASTAS</p>

                  </div>
                  <span className="px-1">=</span>
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center">
                      {boleta.field_data.weight_baskets}
                    </span>
                    <p className="text-xs mt-0.5">TARA</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-1/3"><span className="font-bold">C.</span> PESO MATERIA PRIMA (A) - (B)</span>
                <div className="flex-1 flex justify-end">
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.field_data.net_weight}
                    </span>
                    <p className="text-xs mt-0.5">PESO NETO</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-1/3"><span className="font-bold">D.</span> PESO A PAGAR = % DE CALIDAD</span>
                <div className="flex-1 flex items-center justify-end space-x-2">
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.field_data.percentage_field}
                    </span>
                    <p className="text-xs mt-0.5">%CC A PAGAR</p>
                  </div>
                  <span className="px-2">=</span>
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center">
                      {boleta.field_data.valid_pounds}
                    </span>
                    <p className="text-xs mt-0.5">LIBRAS A PAGAR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black p-6 col-span-12 md:col-span-4 bg-yellow-100">
            <p className="text-center font-bold mb-8 text-lg uppercase">DATOS DE PLANTA</p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-1 flex justify-end">
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1.5 inline-block w-full text-center ">
                      {boleta.prod_data?.gross_weight}
                    </span>
                    <p className="text-xs mt-0.5">PESO BRUTO</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-1 flex items-center justify-end gap-2">
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.prod_data?.total_baskets}
                    </span>
                    <p className="text-xs mt-0.5">CANTIDAD DE CANASTAS</p>
                  </div>
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.prod_data?.weight_baskets}
                    </span>
                    <p className="text-xs mt-0.5">X PESO POR CANASTAS</p>
                  </div>
                  <span>=</span>
                  <div className="text-center w-28">
                    <span className="border border-black  py-1 inline-block w-9/12 text-center ">
                      {boleta.prod_data?.tara}
                    </span>
                    <p className="text-xs mt-0.5">TARA</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-1 flex justify-end">
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.prod_data?.net_weight}
                    </span>
                    <p className="text-xs mt-0.5">PESO NETO</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-1 flex items-center justify-end gap-2">
                  <div className="text-center w-28">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.quality_doc_data?.percentage}
                    </span>
                    <p className="text-xs mt-0.5">%CC A PAGAR</p>
                  </div>
                  <span className="px-2">=</span>
                  <div className="text-center w-40">
                    <span className="border border-black px-3 py-1 inline-block w-full text-center ">
                      {boleta.quality_doc_data?.valid_pounds}
                    </span>
                    <p className="text-xs mt-0.5">LIBRAS VALIDADAS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-black py-1 md:p-2 col-span-12 md:col-span-2">
            <p className="text-center font-bold mb-2 md:mb-3 text-base md:text-lg py-5">DIFERENCIA</p>
            <div className="space-y-2 md:space-y-12 flex flex-col items-center">
              <div className="border border-black px-1 min-w-[120px] text-center h-8 flex items-center justify-center">{boleta.field_data.gross_weight - (boleta.prod_data?.gross_weight ?? 0)}</div>
              <div className="border border-black px-1 min-w-[120px] text-center h-8 flex items-center justify-center">{boleta.field_data.weight_baskets - (boleta.prod_data?.tara ?? 0)}</div>
              <div className="border border-black px-1 min-w-[120px] text-center h-8 flex items-center justify-center">{boleta.field_data.net_weight - (boleta.prod_data?.net_weight ?? 0)}</div>
              <div className="border border-black px-1 min-w-[120px] text-center h-8 flex items-center justify-center">{boleta.field_data.valid_pounds - (boleta.quality_doc_data?.valid_pounds ?? 0)}</div>
              <div className="px-1 min-w-[120px] text-center h-8 flex items-center justify-center">{boleta.consignacion ? <AlertCircle className="text-red-500" /> : <CheckCircle className="text-green-500" />}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-sm text-center text-gray-600">
          <p>ORIGINAL (BLANCO) PRODUCTOR • DUPLICADO (ROSADO) CONTAB./DAD • TRIPLICADO (AMARILLO) ARCHIVO</p>
          <p>Correlativo del 170,001 al 172,500 de fecha 23/04/2023</p>
        </div>

        <div className="grid grid-cols-3">
          {boleta.prod_data?.receptor_signature && (
            <div className="text-center">
              <div className="border-b border-black h-25 md:h-20 flex items-center justify-center max-w-96">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${boleta.prod_data?.receptor_signature}`}
                  alt="Firma Receptor"
                  className="max-h-25 md:max-h-25 object-contain"
                />
              </div>
              <p className="mt-2">FIRMA RECEPTOR</p>
            </div>
          )}

          {boleta.quality_doc_data?.inspector_planta_signature && (
            <div className="text-center">
              <div className="border-b border-black h-16 md:h-20 flex items-center justify-center max-w-96">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/storage/${boleta.quality_doc_data?.inspector_planta_signature}`}
                  alt="Firma Inspector Planta"
                  className="max-h-25 md:max-h-25 object-contain"
                />
              </div>
              <p className="mt-2">FIRMA INSPECTOR PLANTA</p>
            </div>
          )}


          <div className="text-center">
            <div className="border-b border-black h-16 md:h-20 flex items-center justify-center max-w-96">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/storage/${boleta.field_data.calidad_signature}`}
                alt="Firma Inspector Agrícola"
                className="max-h-25 md:max-h-25 object-contain"
              />
            </div>
            <p className="mt-2">FIRMA CALIDAD</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoletaCampoRMP;