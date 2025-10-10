import { BoletaRmpAllInfo } from "@/types/rmpDocTypes";
import LogoLegumex from "../logos/LogoLegumex";


type Props = {
    boleta: BoletaRmpAllInfo;
}

export default function InspeccionTransporte({ boleta }: Props) {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 border border-gray-300 mt-4 md:mt-8 lg:mt-10 space-y-16">
            <div className="grid grid-cols-12 grid-rows-3 gap-4 p-3">
                <div className="col-start-1 col-end-3 row-start-1 row-end-3 flex items-center justify-center">
                    <LogoLegumex />
                </div>
                <div className="col-start-3 col-end-10 row-start-1 row-end-1 flex items-center justify-center uppercase font-bold">Formato</div>
                <div className="col-start-3 col-end-10 row-start-2 row-end-3 flex items-center justify-center uppercase font-bold">INSPECCIÓN DE CARGA Y TRANSPORTE RECEPCION DE MATERIA PRIMA</div>
                <div className="col-start-10 col-end-13 row-start-1 row-end-1 flex items-center justify-start uppercase font-bold">Codigo: <span className="ml-2 font-normal"> FOR-CI-20</span></div>
                <div className="col-start-10 col-end-13 row-start-2 row-end-2 flex items-center justify-start uppercase font-bold">VERSIÓN: <span className="ml-2 font-normal">03</span> </div>
                <div className="col-start-10 col-end-13 row-start-3 row-end-3 flex items-center justify-start uppercase font-bold">PAGINAS: <span className="ml-2 font-normal">1</span> </div>
            </div>

            <div className="grid grid-cols-6 grid-rows-4 gap-2 p-3">
                <div className="col-start-1 col-end-3 row-start-1 uppercase font-bold">PlANTA: <span className="ml-2 font-normal">{boleta.transport_data?.planta}</span></div >
                <div className="col-start-1 col-end-3 row-start-2 uppercase font-bold">Nombre del piloto: <span className="ml-2 font-normal">{boleta.transport_data?.pilot_name}</span></div >
                <div className="col-start-1 col-end-3 uppercase font-bold">Producto: <span className="ml-2 font-normal">{boleta.transport_data?.product}</span> </div>
                <div className="col-start-4 col-end-6 row-start-2 uppercase font-bold">Fecha de recepción:<span className="ml-2 font-normal">{boleta.transport_data?.date}</span> </div>
                <div className="col-start-1 col-end-3 uppercase font-bold">Tipo de Camión: <span className="ml-2 font-normal">{boleta.transport_data?.truck_type}</span> </div>
                <div className="col-start-4 col-end-6 row-start-3 uppercase font-bold">Placa: <span className="ml-2 font-normal">{boleta.transport_data?.plate}</span> </div>
                <div className="col-start-4 col-end-6 row-start-4 uppercase font-bold">Verificado Por: <span className="ml-2 font-normal">{boleta.transport_data?.verify_by}</span> </div>
            </div>

            <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 md:mt-8 lg:mt-10 space-y-16">
                <div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                                <th className="p-3 border-t border-l border-r border-black uppercase font-bold text-center">Si</th>
                                <th className="p-3 border border-black uppercase font-bold text-center">No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boleta.transport_data?.conditions.map((condition, index) => (
                                <tr key={condition.id} className=" last:border last:border-black">
                                    <td className="p-3 border-t border-l border-black uppercase">{index + 1}</td>
                                    <td className="p-3 border-t border-l border-black uppercase">{condition.condition}</td>
                                    <td className="p-3 border border-black text-center">{condition.status ? 'X' : ''}</td>
                                    <td className="p-3 border-b border-r border-t border-black text-center">{!condition.status ? 'X' : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2">
                <div className="col-start-1 col-end-2 row-start-1 row-end-1 uppercase font-bold flex items-center justify-items-start">Observaciones:</div>
                <div className="col-start-1 col-end-3 row-start-2 row-end-2 border border-black p-5">
                    {boleta.transport_data?.observations}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 w-5/6 mx-auto">
                <div className="text-center">
                    <div className="border-b border-black h-16 md:h-20 flex items-center justify-center my-6 mx-auto">
                        <img
                            src={`${import.meta.env.VITE_BASE_URL}/storage/${boleta.transport_data?.verify_by_signature}`}
                            alt="Firma Inspector Planta"
                            className="max-h-20 md:max-h-20 object-contain"
                        />
                    </div>
                    <p className="mt-2 font-bold">VERIFICADO POR</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-16 md:h-20 flex items-center justify-center my-6 mx-auto">
                        <p className="font-bold">{boleta.transport_data?.date}</p>
                    </div>
                    <p className="mt-2 font-bold">FECHA</p>
                </div>
            </div>

        </div>
    )
}