import LogoLegumex from "../LogoLegumex";

export default function InspeccionTransporte() {
    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 border border-gray-300 mt-4 md:mt-8 lg:mt-10 space-y-16">
            {/* Aumentamos el espacio vertical de space-y-10 a space-y-16 (64px) */}

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

            <div className="grid grid-cols-6 grid-rows-4 gap-4 p-3">
                <div className="col-start-1 col-end-3 row-start-1 uppercase font-bold">PlANTA: <span className="ml-2 font-normal">Insertar Dato aca</span></div >
                <div className="col-start-1 col-end-3 row-start-2 uppercase font-bold">Nombre del piloto: <span className="ml-2 font-normal">Insertar Dato aca</span></div >
                <div className="col-start-1 col-end-3 uppercase font-bold">Producto: <span className="ml-2 font-normal">Insertar Dato aca</span> </div>
                <div className="col-start-4 col-end-6 row-start-2 uppercase font-bold">Fecha de recepción:<span className="ml-2 font-normal">Insertar Dato aca</span> </div>
                <div className="col-start-1 col-end-3 uppercase font-bold">Tipo de Camión: <span className="ml-2 font-normal">Insertar Dato aca</span> </div>
                <div className="col-start-4 col-end-6 row-start-3 uppercase font-bold">Placa: <span className="ml-2 font-normal">Insertar Dato aca</span> </div>
            </div>

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
                        <tr>
                            <td className="p-3 border-t border-l border-black uppercase">1</td>
                            <td className="p-3 border-t border-l border-black uppercase">Limpieza adecuada del interior</td>
                            <td className="p-3 border border-black">Prueba</td>
                            <td className="p-3 border-b border-r border-t border-black">Prueba</td>
                        </tr>
                        <tr>
                            <td className="p-3 border-t border-l border-b border-black uppercase">2</td>
                            <td className="p-3 border border-black uppercase">Uso de lona</td>
                            <td className="p-3 border-b border-l border-black">Prueba</td>
                            <td className="p-3 border-l border-r border-b border-black">Prueba</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 grid-rows-2">
                <div className="col-start-1 col-end-2 row-start-1 row-end-1 uppercase font-bold flex items-center justify-items-start">Observaciuones:</div>
                <div className="col-start-1 col-end-3 row-start-2 row-end-2">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, quos excepturi! Voluptas cumque quos fugit soluta numquam distinctio labore et saepe. Ipsa enim perspiciatis provident vero. Inventore incidunt magnam id.
                </div>
            </div>

            <div className="grid grid-cols-3 p-5">
                <div className="uppercase col-start-1 col-end-2 row-start-1 row-end-1 border-t border-black flex items-center justify-center font-bold">Verificado por:</div>
                <div className="uppercase col-start-1 col-end-2 row-start-2 row-end-2 border-t border-black flex items-center justify-center font-bold mt-16">Gerente de calidad</div>
                <div className="uppercase col-start-3 col-end-4 row-start-2 row-end-2 border-t border-black flex items-center justify-center font-bold mt-16">Fecha</div>
            </div>

        </div>
    )
}