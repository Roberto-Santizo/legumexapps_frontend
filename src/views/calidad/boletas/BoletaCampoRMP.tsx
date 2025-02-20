
import LOGO_LX from '../../../../public/LOGO_LX.png'
const BoletaCampoRMP = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-yellow-100 border border-gray-300 mt-4 md:mt-8 lg:mt-10 ">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
        <div className="w-20 md:w-24 h-14 md:h-16 flex items-center justify-center">
            <img src={LOGO_LX} alt="LEGUMEX, S.A." className="h-full object-contain" />
          </div>
          <div className="text-sm">
            <p>12 AVENIDA 6-15 ZONA 2 SECTOR</p>
            <p>LAS MAJADAS, EL TEJAR, CHIMALTENANGO</p>
            <p>PBX: 7963-0888 FAX: 7937-5005</p>
          </div>
        </div>

        <div className="text-center flex-1 mx-4 md:mx-8">
          <h1 className="text-xl md:text-2xl font-bold">RECIBO DE MATERIA PRIMA</h1>
        </div>

        <div className="text-right text-sm md:text-base">
          <p>R-PRO-MP-02</p>
          <p className="flex justify-between gap-2 md:gap-4">
            <span>GRN No.</span>
            <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right"></span>
          </p>
          <p className="flex justify-between gap-2 md:gap-4">
            <span>FECHA</span>
            <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right"></span>
          </p>
          <p className="flex justify-between gap-2 md:gap-4">
            <span>C.D.P.</span>
            <span className="border-b border-black min-w-[100px] md:min-w-[150px] text-right"></span>
          </p>
        </div>
      </div>

      {/* Sub-header Information */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6 text-sm md:text-base">
        <div className="flex space-x-2">
          <span>PLANTA CONGELADORA:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>TRANSP:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>PILOTO:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>COORDINADOR:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>COD. TRANSP.:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>PLACA:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>PRODUCTO:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>COD. INSPEC:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2">
          <span>INSPECT:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
        <div className="flex space-x-2 col-span-2 md:col-span-3">
          <span>VARIEDAD PRODUCTO:</span>
          <span className="border-b border-black flex-grow"></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Left Section - DATOS CAMPO */}
        <div className="border border-black p-3 md:p-4">
          <p className="text-center font-bold mb-4 md:mb-6 text-base md:text-lg">DATOS CAMPO</p>
          <div className="space-y-4 md:space-y-6">
            <div>
              <p className="flex justify-between">
                <span>A. PESO BRUTO</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
              <div className="flex justify-between items-center mt-2 md:mt-3 gap-2 md:gap-3">
                <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                  <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span> {/*Estas  son las lineas*/ }
                  <span>X</span>
                  <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span>
                </div>
                <span>=</span>
                <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span>
              </div>
              <p className="text-xs md:text-sm text-center mt-1">CANTIDAD DE CANASTAS X PESO POR CANASTAS</p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>B. TARA</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>C. PESO MATERIA PRIMA (A) - (B)</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>D. PESO A PAGAR = % DE CALIDAD</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section - DATOS DE PLANTA */}
        <div className="border border-black p-3 md:p-4">
          <p className="text-center font-bold mb-4 md:mb-6 text-base md:text-lg">DATOS DE PLANTA</p>
          <div className="space-y-4 md:space-y-6">
            <div>
              <p className="flex justify-between">
                <span>PESO BRUTO</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
              <div className="flex justify-between items-center mt-2 md:mt-3 gap-2 md:gap-3">
                <div className="flex items-center space-x-2 md:space-x-3 flex-1">
                  <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span> {/*we have to fix this line*/}
                  <span>X</span>
                  <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span>{/*we have to fix this line*/}
                </div>
                <span>=</span>
                <span className="border border-black px-2 md:px-3 min-w-0 flex-1"></span>{/*we have to fix this line*/}
              </div>

              <p className="text-xs md:text-sm text-center mt-1">CANTIDAD DE CANASTAS X PESO POR CANASTAS</p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>TARA</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>PESO NETO</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>LIBRAS VALIDADAS</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - DIFERENCIA */}
        <div className="border border-black p-3 md:p-4">
          <p className="text-center font-bold mb-4 md:mb-6 text-base md:text-lg">DIFERENCIA</p>
          <div className="space-y-4 md:space-y-6">
            <div>
              <p className="flex justify-between">
                <span>PESO BRUTO</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>TARA</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>PESO NETO</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>

            <div>
              <p className="flex justify-between">
                <span>LIBRAS VALIDADAS</span>
                <span className="border border-black px-2 md:px-3 min-w-[90px] md:min-w-[120px]"></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 md:mt-6 text-sm text-center text-gray-600">
        <p>ORIGINAL (BLANCO) PRODUCTOR • DUPLICADO (ROSADO) CONTAB./DAD • TRIPLICADO (AMARILLO) ARCHIVO</p>
        <p>Correlativo del 170,001 al 172,500 de fecha 23/04/2023</p>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-sm md:text-base">
        <div className="text-center">
          <div className="border-b border-black h-8 md:h-10"></div>
          <p>NOMBRE INSPECTOR AGRICOLA</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black h-8 md:h-10"></div>
          <p>NOMBRE DEL PRODUCTOR</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black h-8 md:h-10"></div>
          <p>NOMBRE RECEPTOR</p>
        </div>
        <div className="text-center">
          <div className="border-b border-black h-8 md:h-10"></div>
          <p>NOMBRE INSPECTOR PLANTA</p>
        </div>
      </div>
    </div>
  );
};

export default BoletaCampoRMP;