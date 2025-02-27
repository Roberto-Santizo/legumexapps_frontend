import { BoletaInfoAll } from "@/types";
import LogoLegumex from "../LogoLegumex";


type Props = {
  boleta: BoletaInfoAll;
}

export default function InspeccionTransporte({boleta} : Props) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 border border-gray-300 mt-4 md:mt-8 lg:mt-10 space-y-10">

            <div className="grid grid-cols-12 grid-rows-3 gap-4 p-3">
                <div className="col-start-1 col-end-3 row-start-1 row-end-3 flex items-center justify-center">
                    <LogoLegumex />
                </div>
                <div className="col-start-3 col-end-10 row-start-1 row-end-1  flex items-center justify-center uppercase font-bold">Formato</div>
                <div className="col-start-3  col-end-10 row-start-2 row-end-3 flex items-center justify-center uppercase font-bold">INSPECCIÓN DE CARGA Y TRANSPORTE RECEPCION DE MATERIA PRIMA</div>
                <div className="col-start-10  col-end-13 row-start-1 row-end-1 flex items-center justify-start uppercase font-bold">Codigo: <span className="ml-2 font-normal"> FOR-CI-20</span></div>
                <div className="col-start-10  col-end-13 row-start-2 row-end-2 flex items-center justify-start uppercase font-bold">VERSIÓN: <span className="ml-2 font-normal">03</span> </div>
                <div className="col-start-10  col-end-13 row-start-3 row-end-3 flex items-center justify-start uppercase font-bold">PAGINAS:  <span className="ml-2 font-normal">1</span> </div>
            </div>

            <div className="grid grid-cols-6 grid-rows-4 gap-4 p-3">
                <div className="col-start-1 col-end-3 row-start-1 uppercase font-bold">PlANTA: <span className="ml-2 font-normal"></span></div >
                <div className="col-start-1 col-end-3 row-start-2 uppercase font-bold">Nombre del piloto: <span className="ml-2 font-normal">{boleta.transport_data?.pilot_name}</span></div >
                <div className="col-start-1 col-end-3 uppercase font-bold">Producto: <span className="ml-2 font-normal">{boleta.transport_data?.product}</span> </div>
                <div className="col-start-4 col-end-6 row-start-2 uppercase font-bold">Fecha de recepción:<span className="ml-2 font-normal">{boleta.transport_data?.date}</span> </div>
                <div className="col-start-1 col-end-3 uppercase font-bold">Tipo de Camión: <span className="ml-2 font-normal">{boleta.transport_data?.truck_type}</span> </div>
                <div className="col-start-4 col-end-6 row-start-3 uppercase font-bold">Placa: <span className="ml-2 font-normal">{boleta.transport_data?.plate}</span> </div>
            </div>

            <div className="grid grid-cols-4 grid-rows-2 p-3">
                
            </div>

            <div className="grid grid-cols-2 grid-rows-2">
                <div className="col-start-1 col-end-2 row-start-1 row-end-1 uppercase font-bold flex items-center justify-items-start">Observaciones:</div>
                <div className="col-start-1 col-end-3 row-start-2 row-end-2">
                    OBS
                </div>
            </div>

            <div className="grid grid-cols-3 grid-row2 mt-30 p-5 space-y-20">
                <div className="uppercase col-start-1 col-end-2 row-start-1 row-end-1 border-t border-black flex flex-items-center justify-center font-bold"> Verificado por:</div>
                <div className="uppercase col-start-1 col-end-2 row-start-2 row-end-2 border-t border-black flex flex-items-center justify-center font-bold">Gerente de calidad</div>
                <div className="uppercase col-start-3  col-end-4 row-start-2 row-end-2 border-t border-black flex flex-items-center justify-center font-bold">Fecha </div>
            </div>

        </div>
    )
}
