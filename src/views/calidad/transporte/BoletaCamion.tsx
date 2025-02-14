import { Truck, Check } from 'lucide-react';

const BoletaCamion = () => {
  return (
    <>
      <h2 className="text-4xl font-bold flex items-center gap-3">
        Inspección de Transporte
      </h2>

      <div>
        <form className="mt-10 w-2/3 mx-auto bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl p-8 space-y-6">
          {/* Campos de entrada */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="planta">
                Planta:
              </label>
              <input
                autoComplete="off"
                id="planta"
                type="text"
                placeholder="Nombre de la planta"
                className="border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold uppercase text-gray-700" htmlFor="camion">
                Tipo de Camión:
              </label>
              <input
                autoComplete="off"
                id="camion"
                type="text"
                placeholder="Tipo de camión"
                className="border border-gray-300 rounded-lg p-3 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>

          {/* Tabla de condiciones */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white mt-8">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="bg-gray-50 p-4 text-lg font-semibold text-gray-900">Condición</th>
                  <th className="bg-gray-50 p-4 text-lg font-semibold text-gray-900 w-24 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Limpieza adecuada del interior",
                  "Uso de lona",
                  "Sin presencia de fragmentos de madera",
                  "Carrocería de madera en buen estado",
                  "Sin exceso de humedad (evidencia de moho)",
                  "Sin presencia de material extraño nocivo",
                  "Sin evidencia de actividad de Insectos",
                  "Sin evidencia de heces",
                  "Sin presencia de combustible o químicos",
                  "Sin Evidencia de Roedores",
                  "Sin presencia de malos olores",
                  "Sin presencia de alérgenos"
                ].map((permiso, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 last:border-0 transition-colors duration-150
                      ${index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}`}
                  >
                    <td className="p-4">
                      <label
                        htmlFor={`permiso-${index}`}
                        className="text-base text-gray-700 font-medium cursor-pointer hover:text-gray-900 flex items-center gap-2"
                      >
                        {permiso}
                      </label>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <input
                            type="checkbox"
                            id={`permiso-${index}`}
                            name="permisos[]"  // Este es el cambio clave - añadir name como array
                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-300  checked:border-blue-500 checked:bg-blue-500 group-hover:border-blue-400 transition-all duration-200"
                          />
                          <Check
                            className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 
                                     text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                          />
                          <div className="absolute -inset-2 rounded-lg bg-blue-50 opacity-0 
                                      group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg 
                     transition-colors duration-200 mt-6 flex items-center justify-center gap-2 shadow-lg"
          >
            <Truck className="w-5 h-5" />
            <span className="text-lg">Crear boleta</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default BoletaCamion;