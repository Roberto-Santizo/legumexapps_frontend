
export default function SkeletonLoading() {
  return (
    <div>
      <div className="animate-pulse">
        <table className="table mt-10 w-full border-collapse">
          <thead>
            <tr className="thead-tr">
              {["Tarea", "Presupuesto", "Horas", "Receta", "Cultivo", "Semana de Aplicación"].map((_, idx) => (
                <th key={idx} className="thead-th text-left px-4 py-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="tbody-tr border-b border-gray-200">
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-5/6"></div></td>
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-4/5"></div></td>
                <td className="tbody-td px-4 py-3"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Skeleton Pagination */}
        <div className="flex justify-end items-center gap-4 mt-6">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-10"></div>
          <div className="h-6 bg-gray-200 rounded w-10"></div>
          <div className="h-6 bg-gray-200 rounded w-10"></div>
        </div>
      </div>
    </div>

  )
}
