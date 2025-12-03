import { BoletaRmpAllInfo } from "types/rmpDocTypes";
import LogoLegumex from "../logos/LogoLegumex";

type Props = {
    boleta: BoletaRmpAllInfo;
}

export default function BoletasCalidad({ boleta }: Props) {

    return (
        <div className="w-full max-w-7xl mx-auto p-10 shadow-xl border border-gray-300 mt-10 print:w-[297mm] print:h-[210mm] print:max-w-none print:mx-0 print:mt-0 print:bg-white print:p-4 print:shadow-none space-y-11">
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6 text-sm md:text-base items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-20 md:w-32 h-14 md:h-16 flex items-center justify-center">
                        <LogoLegumex />
                    </div>
                </div>
                <div className="text-center">
                    <h1 className="text-xl uppercase font-bold">Formato</h1>
                    <span className="p-1 text-center text-2xl font-bold text-red-600">
                        LXC-{boleta.quality_doc_data?.id}
                    </span>
                    <h2 className="text-lg uppercase">Recepción Materia Prima</h2>
                </div>
                <div className="text-right">
                    <p className="text-base uppercase font-bold">Código:<span className="font-normal ml-4">FOR-CI-02</span></p>
                    <p className="text-base uppercase font-bold">Versión:<span className="font-normal ml-4">01</span></p>
                    <p className="text-base uppercase font-bold">PÁGINAS 1 DE 1</p>
                </div>
            </div>

            <div>
                <div className="w-2/3 font-bold justify-end uppercase">Fecha: <span className="font-normal">{boleta.quality_doc_data?.date}</span></div>
            </div>

            <div className="grid grid-cols-2 grid-rows-4 border border-black">
                <div className="uppercase font-bold border-r border-b border-black p-2">Productor:
                    <span className="font-normal ml-3">{boleta.quality_doc_data?.producer_name}</span>
                </div>
                <div className="uppercase font-bold border-b border-black p-2">Producto:
                    <span className="font-normal ml-3">{boleta.field_data?.product}</span>
                </div>

                <div className="uppercase font-bold border-r border-b border-black p-2">Variedad:
                    <span className="font-normal ml-3">{boleta.field_data?.variety}</span>
                </div>
                <div className="uppercase font-bold border-b border-black p-2">CDP:
                    <span className="font-normal ml-3">{boleta.field_data?.cdp}</span>
                </div>

                <div className="uppercase font-bold border-r border-b border-black p-2">GRN:
                    <span className="font-normal ml-3">{boleta.grn}</span>
                </div>
                <div className="uppercase font-bold border-b border-black p-2">No. De Canastas:
                    <span className="font-normal ml-3">{boleta.quality_doc_data?.total_baskets}</span>
                </div>

                <div className="uppercase font-bold border-r border-black p-2">Peso Neto:
                    <span className="font-normal ml-3">{boleta.quality_doc_data?.net_weight}</span>
                </div>
                <div className="uppercase font-bold border-black p-2">Tamaño de la muestra:
                    <span className="font-normal ml-3">{boleta.quality_doc_data?.sample_units}</span>
                </div>
            </div>

            <div className="mb-6 mt-5">
                <table className="w-full">
                    <thead>
                        <tr>
                            <td className="border border-black p-2 text-center uppercase font-bold">Puntos a verificar</td>
                            <td className="border border-black p-2 text-center uppercase font-bold">Porcentaje</td>
                            <td className="border border-black p-2 text-center font-bold uppercase">Tolerancia</td>
                            <td className="border border-black p-2 text-center font-bold uppercase">Resultado</td>
                        </tr>
                    </thead>
                    <tbody>
                        {boleta.quality_doc_data?.defects.map((defect, index) => (
                            <tr key={index} className="text-center">
                                <td className="w-1/6 border border-black p-2">{defect.name.toUpperCase()}</td>
                                <td className="border border-black p-2">{defect.input_percentage}%</td>
                                <td className="border border-black p-2">{defect.tolerace_percentage}%</td>
                                <td className="border border-black p-2">{defect.result}</td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="border border-black p-2 uppercase text-right font-bold">Total de % defectos</td>
                            <td className="border border-black p-2">{100 - +(boleta.quality_doc_data?.percentage ?? 0)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td className="border border-black p-2 uppercase text-right font-bold">% calidad</td>
                            <td className="border border-black p-2">{boleta.quality_doc_data?.percentage}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <p className="text-sm font-bold mb-2">OBSERVACIONES:</p>
                <p className="p-2 border border-black min-h-[6rem]">{boleta.quality_doc_data?.observations}</p>
            </div>

            <div className="text-center">
                <div className="border-b border-black h-16 md:h-20 flex items-center justify-center my-6 mx-auto w-6/12">
                    <img
                        src={`${import.meta.env.VITE_BASE_URL}storage/${boleta.quality_doc_data?.inspector_planta_signature}`}
                        alt="Firma Inspector Planta"
                        className="max-h-20 md:max-h-20 object-contain"
                    />
                </div>
                <p className="mt-2">NOMBRE INSPECTOR PLANTA</p>
            </div>

            <div className="mt-6 text-sm text-center text-gray-600">
                <p>FOR-CI-02. Agroindustria Legumex, Chimaltenango Guatemala. FEBRERO 2025</p>
            </div>
        </div>
    );
}
