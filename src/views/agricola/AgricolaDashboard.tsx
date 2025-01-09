import { Check, Clock, Eye, FileIcon, PlusIcon, XIcon } from "lucide-react";
import DronIcon from "../../components/DronIcon";

export default function AgricolaDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Dashboard Agricola</h1>
      <h2 className="font-bold uppercase text-4xl">
        Semana en presentación: 2 <span className="text-xs">(calendario)</span>
      </h2>

      <div className="mt-10 grid grid-cols-12 gap-5">
        {/* contenedor principal */}
        <div className="flex flex-col items-center shadow-xl col-start-1 col-span-3 rounded-xl">
          {/* contenedor horas dron */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Horas Dron Semanal
          </p>
          <DronIcon />
          <p className="text-2xl font-bold mb-5">30 Horas</p>
        </div>

        <div className="flex flex-col items-center shadow-xl col-start-4 col-span-5 rounded-xl">
          {/* contenedor de descarga de reporteria */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Descarga de Reporteria
          </p>
          <div className="mt-5 p-5 shadow flex justify-center items-center gap-5">
            <p className="font-bold uppercase">
              Control de Presupuesto de semana 2
            </p>
            <FileIcon className="cursor-pointer hover:text-gray-300" />
          </div>
          <div className="mt-5 w-full p-5">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-400 text-white uppercase">
                <tr className="text-xs md:text-sm rounded ">
                  <th scope="col">Finca</th>
                  <th scope="col">Semana</th>
                  <th scope="col">Tareas Generales</th>
                  <th scope="col">Planilla Semanal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA ALAMEDA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">2</td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <FileIcon />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap flex justify-center">
                    <FileIcon />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl col-start-9 col-span-4 rounded-xl">
          {/* contenedor de acciones de planes semanales */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Planes Semanales Acciones
          </p>

          <div className="flex justify-between gap-5">
            <div className="flex flex-col justify-center items-center hover:bg-gray-200 p-2 mt-5 rounded-lg cursor-pointer">
              <PlusIcon className="rounded-xl w-12 h-12" />
              <p className="font-bold uppercase text-xs">Crear Plan Semanal</p>
            </div>
            <div className="flex flex-col justify-center items-center hover:bg-gray-200 p-2 mt-5 rounded-lg cursor-pointer">
              <PlusIcon className="rounded-xl w-12 h-12" />
              <p className="font-bold uppercase text-xs">Crear Tarea</p>
            </div>
            <div className="flex flex-col justify-center items-center hover:bg-gray-200 p-2 mt-5 rounded-lg cursor-pointer">
              <PlusIcon className="rounded-xl w-12 h-12" />
              <p className="font-bold uppercase text-xs">Crear Tarea Ext</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl row-start-2 col-start-1 col-span-12 rounded-xl gap-5">
          {/* contenedor de resumen de horas */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Resumen de Horas Por Empleado Semana 2
          </p>

          <div className="w-full p-2">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-400 text-white uppercase">
                <tr className="text-xs md:text-sm rounded ">
                  <th scope="col">Codigo</th>
                  <th scope="col">Empleado</th>
                  <th scope="col">Total de Horas</th>
                  <th scope="col">Activo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    LEG02528
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    SILVIA ISABEL RUIZ SILIEZAR
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    0 horas
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap flex justify-center">
                    <XIcon />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl row-start-3 col-start-1 col-span-12 rounded-xl gap-5">
          {/* contenedor de control de tareas en proceso */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Control de Tareas en Proceso y Asignaciones
          </p>

          <div className="w-full p-5 font-bold space-y-5">
            <a
              href=""
              className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
            >
              <div className="flex gap-2">
                <Clock />
                <p>Tarea: LIMPIEZA/CALZA - FINCA TEHUYA - FT-001 - S2</p>
              </div>
              <p>Empleados Asignados: 32/36</p>
            </a>
            <a
              href=""
              className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
            >
              <div className="flex gap-2">
                <Clock />
                <p>Tarea: LIMPIEZA/CALZA - FINCA TEHUYA - FT-001 - S2</p>
              </div>
              <p>Empleados Asignados: 32/36</p>
            </a>
            <a
              href=""
              className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
            >
              <div className="flex gap-2">
                <Clock />
                <p>Tarea: LIMPIEZA/CALZA - FINCA TEHUYA - FT-001 - S2</p>
              </div>
              <p>Empleados Asignados: 32/36</p>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5">
          {/* contenedor de tareas terminadas*/}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Control de tareas terminadas
          </p>

          <div className="w-full p-2">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-400 text-white uppercase">
                <tr className="text-xs md:text-sm rounded ">
                  <th scope="col"></th>
                  <th scope="col">TAREA</th>
                  <th scope="col">FINCA</th>
                  <th scope="col">LOTE</th>
                  <th scope="col">FECHA DE INICIO</th>
                  <th scope="col">FECHA DE CIERRE</th>
                  <th scope="col">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Check />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FERTILIZACIÓN 6
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA TEHUYA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FT-001
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Eye className="cursor-pointer hover:text-gray-400" />
                  </td>
                </tr>
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Check />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FERTILIZACIÓN 6
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA TEHUYA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FT-001
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Eye className="cursor-pointer hover:text-gray-400" />
                  </td>
                </tr>
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Check />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FERTILIZACIÓN 6
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA TEHUYA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FT-001
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Eye className="cursor-pointer hover:text-gray-400" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl row-start-5 col-start-1 col-span-12 rounded-xl gap-5">
          {/* contenedor de resumen de horas */}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Control de Cosechas en Proceso
          </p>

          <div className="w-full p-2">
            <div className="font-bold space-y-5">
              <a
                href=""
                className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
              >
                <div className="flex gap-2">
                  <Clock />
                  <p>Tarea: LIMPIEZA/CALZA - FINCA TEHUYA - FT-001 - S2</p>
                </div>
                <p>Empleados Asignados: 32/36</p>
              </a>
              <a
                href=""
                className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
              >
                <div className="flex gap-2">
                  <Clock />
                  <p>Tarea: LIMPIEZA/CALZA - FINCA TEHUYA - FT-001 - S2</p>
                </div>
                <p>Empleados Asignados: 32/36</p>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center shadow-xl row-start-6 col-start-1 col-span-12 rounded-xl gap-5">
          {/* contenedor de tareas terminadas*/}
          <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
            Control de cosechas terminadas
          </p>

          <div className="w-full p-2">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-400 text-white uppercase">
                <tr className="text-xs md:text-sm rounded ">
                  <th scope="col"></th>
                  <th scope="col">TAREA</th>
                  <th scope="col">FINCA</th>
                  <th scope="col">LOTE</th>
                  <th scope="col">FECHA DE COSECHA</th>
                  <th scope="col">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Check />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    COSECHA 1
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA TEHUYA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FT-001
                  </td>
                  
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Eye className="cursor-pointer hover:text-gray-400" />
                  </td>
                </tr>
                <tr className="text-center">
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Check />
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    COSECHA 1
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FINCA ALAMEDA
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    FT-001
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    06-01-2025 09:01:39 AM
                  </td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">
                    <Eye className="cursor-pointer hover:text-gray-400" />
                  </td>
                </tr>
               
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
