import { useState } from 'react';
import { Eye, Search } from 'lucide-react';

const CompletedTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const completedTasks = [
    {
      id: 1,
      tarea: "RIEGO 4",
      finca: "FINCA ALAMEDA",
      lote: "FAL005",
      fechaInicio: "21-07-2025 07:23:06 AM",
      fechaCierre: "21-07-2025 07:23:06 AM"
    },
    {
      id: 2,
      tarea: "RIEGO 6",
      finca: "FINCA ALAMEDA",
      lote: "FAL009",
      fechaInicio: "21-07-2025 12:02:34 PM",
      fechaCierre: "21-07-2025 12:02:34 PM"
    },
    {
      id: 3,
      tarea: "FERTILIZACIÓN 5",
      finca: "FINCA ALAMEDA",
      lote: "FAL010",
      fechaInicio: "22-07-2025 07:00:57 AM",
      fechaCierre: "22-07-2025 07:00:57 AM"
    },
    {
      id: 4,
      tarea: "LIMPIA",
      finca: "FINCA ALAMEDA",
      lote: "FAL010",
      fechaInicio: "21-07-2025 07:36:01 AM",
      fechaCierre: "21-07-2025 07:36:01 AM"
    },
    {
      id: 5,
      tarea: "FUMIGACIÓN 3",
      finca: "FINCA LINDA SOFÍA",
      lote: "FLS002",
      fechaInicio: "20-07-2025 09:15:22 AM",
      fechaCierre: "20-07-2025 11:45:18 AM"
    },
    {
      id: 6,
      tarea: "PODA SANITARIA",
      finca: "FINCA BELLA VISTA",
      lote: "FBV001",
      fechaInicio: "19-07-2025 06:30:15 AM",
      fechaCierre: "19-07-2025 04:20:33 PM"
    }
  ];

  const filteredTasks = completedTasks.filter(task =>
    task.tarea.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.finca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.lote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center shadow-xl row-start-6 col-start-1 col-span-12 rounded-xl gap-5">
      <div className="w-full">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        Reporte de tareas terminadas
      </p>
        <div className="bg-white px-6 py-4 border-l border-r border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar tarea, finca o lote..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-b-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-600 text-white">
                <th className="px-6 py-2 text-left text-sm font-semibold uppercase tracking-wide">
                  TAREA
                </th>
                <th className="px-6 py-2 text-left text-sm font-semibold uppercase tracking-wide">
                  FINCA
                </th>
                <th className="px-6 py-2 text-left text-sm font-semibold uppercase tracking-wide">
                  LOTE
                </th>
                <th className="px-6 py-2 text-left text-sm font-semibold uppercase tracking-wide">
                  FECHA DE INICIO
                </th>
                <th className="px-6 py-2 text-left text-sm font-semibold uppercase tracking-wide">
                  FECHA DE CIERRE
                </th>
                <th className="px-6 py-2 text-center text-sm font-semibold uppercase tracking-wide">
                  ACCIÓN
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr 
                  key={task.id} 
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors duration-150`}
                >
                  <td className="px-6 py-2 text-gray-800">
                    {task.tarea}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {task.finca}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {task.lote}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {task.fechaInicio}
                  </td>
                  <td className="px-6 py-2 text-gray-700">
                    {task.fechaCierre}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                      <Eye className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="bg-white p-8 text-center text-gray-500 rounded-b-lg">
            No se encontraron tareas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;