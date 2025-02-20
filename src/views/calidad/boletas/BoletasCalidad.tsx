
import LOGO_LX from '../../../../public/LOGO_LX.png'

type Props = {
  data?: {
    nombreProductor?: string;
    variedad?: string;
    grn?: string;
    pesoNeto?: string;
    hojaConsechero?: string;
    unidadesMuestra?: string;
    cantidadCanastas?: string;
    codigoProductor?: string;
    ph?: string;
    porcentajePagar?: string;
    brix?: string;
    librasPagables?: string;
    nombreInspector?: string;
    defectos?: {
      porcentajeDefecto?: string;
      resultado?: string;
    }[];
    total?: string;
    porcentajeFinalPagar?: string;
    observaciones?: string;
  };
};

export default function BoletasCalidad({ data = {} }: Props) {
  const defects = [
    { name: 'MANCHAS NEGRAS', tolerance: '2%' },
    { name: 'FUERA DE COLOR', tolerance: '0%' },
    { name: 'PESO < 2.5 LBS', tolerance: '0%' },
    { name: 'SOBREMADUREZ', tolerance: '4%' },
    { name: 'MAQUILLADO', tolerance: '4%' },
    { name: 'PUDRICION', tolerance: '0%' },
    { name: 'ENFERMEDADES', tolerance: '0%' },
    { name: 'VERDES', tolerance: '0%' },
    { name: 'MATERIA EXTRAÑA', tolerance: '0%' },
    { name: 'INSECTOS', tolerance: '0%' }
  ];

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-8 bg-sky-100 border border-grya-300 mt-10
                    print:w-[297mm] print:h-[210mm] print:max-w-none print:mx-0 print:mt-0 
                    print:bg-white print:p-4 print:shadow-none">
        {/* Header section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-2">
          <div className="w-20 md:w-24 h-14 md:h-16 flex items-center justify-center">
            <img src={LOGO_LX} alt="LEGUMEX, S.A." className="h-full object-contain" />
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
                <span className="text-sm">FECHA:</span>
                <span className="text-sm border-b border-black min-w-[60px]"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">HORA:</span>
                <span className="text-sm border-b border-black min-w-[60px]"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Display Data */}
        <div className="border border-black mb-6">
          <div className="grid grid-cols-4 divide-x divide-black">
            {/* Row 1 */}
            <div className="col-span-3 border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">NOMBRE PRODUCTOR:</label>
              <span className="text-sm">{data?.nombreProductor || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">VARIEDAD:</label>
              <span className="text-sm">{data?.variedad || '-'}</span>
            </div>

            {/* Row 2 */}
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">GRN:</label>
              <span className="text-sm">{data?.grn || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">PESO NETO:</label>
              <span className="text-sm">{data?.pesoNeto || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">No. HOJA COSECHERO:</label>
              <span className="text-sm">{data?.hojaConsechero || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">UNIDADES MUESTRA:</label>
              <span className="text-sm">{data?.unidadesMuestra || '-'}</span>
            </div>

            {/* Row 3 */}
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">CANTIDAD DE CANASTAS:</label>
              <span className="text-sm">{data?.cantidadCanastas || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">CODIGO PRODUCTOR:</label>
              <span className="text-sm">{data?.codigoProductor || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">PH:</label>
              <span className="text-sm">{data?.ph || '-'}</span>
            </div>
            <div className="border-b border-black p-2">
              <label className="text-sm font-medium block mb-1">% A PAGAR:</label>
              <span className="text-sm">{data?.porcentajePagar || '-'}</span>
            </div>

            {/* Row 4 */}
            <div className="p-2">
              <label className="text-sm font-medium block mb-1">BRIX {'>'} 12:</label>
              <span className="text-sm">{data?.brix || '-'}</span>
            </div>
            <div className="p-2">
              <label className="text-sm font-medium block mb-1">LIBRAS PAGABLES:</label>
              <span className="text-sm">{data?.librasPagables || '-'}</span>
            </div>
            <div className="col-span-2 p-2">
              <label className="text-sm font-medium block mb-1">NOMBRE INSPECTOR CC:</label>
              <span className="text-sm">{data?.nombreInspector || '-'}</span>
            </div>
          </div>
        </div>

        {/* Defects Table */}
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
              {defects.map((defect, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="p-2 border-r border-black">{defect.name}</td>
                  <td className="p-2 text-center border-r border-black">
                    {data?.defectos?.[index]?.porcentajeDefecto || '-'}
                  </td>
                  <td className="p-2 text-center border-r border-black">{defect.tolerance}</td>
                  <td className="p-2 text-center">
                    {data?.defectos?.[index]?.resultado || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-b border-black">
                <td colSpan={2} className="p-2"></td>
                <td className="p-2 text-right border-r border-black font-bold">TOTAL:</td>
                <td className="p-2 text-center">{data?.total || '-'}</td>
              </tr>
              <tr>
                <td colSpan={2} className="p-2"></td>
                <td className="p-2 text-right border-r border-black font-bold">% A PAGAR:</td>
                <td className="p-2 text-center">{data?.porcentajeFinalPagar || '-'}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Observations */}
        <div className="mt-6">
          <p className="text-sm font-bold mb-2">OBSERVACIONES:</p>
          <p className="p-2 border border-black min-h-[6rem]">{data?.observaciones || '-'}</p>
        </div>

        {/* Footer */}
        <div className="mt-10 grid grid-cols-4 gap-8 text-base">
          <div className="text-center">
            <div className="border-b border-black h-10"></div>
            <p>NOMBRE INSPECTOR AGRICOLA</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black h-10"></div>
            <p>NOMBRE DEL PRODUCTOR</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black h-10"></div>
            <p>NOMBRE RECEPTOR</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black h-10"></div>
            <p>NOMBRE INSPECTOR PLANTA</p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-sm text-center text-gray-600">
          <p>ORIGINAL: Productor • AMARILLO: Administración • CELESTE: Control de Calidad • ROSADO: Agrícola</p>
          <p>Impresos ALFE Antigua G. Tel:5429-5045. Impresos del 36,251 al 38,750. 02/05/2024</p>
        </div>
      </div>
    </>
  );
}

