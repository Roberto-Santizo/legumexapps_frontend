import { ClockIcon, Eye, PlusIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyProductionPlanDrafts } from "@/api/DraftWeeklyProductionPlanAPI";
import { useEffect, useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import ModalCreateDraftPlanProduction from "@/components/modals/ModalCreateDraftPlanProduction";
import Pagination from "@/components/utilities-components/Pagination";

export default function Index() {
  const navigate = useNavigate();
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useQuery({
    queryKey: ['getWeeklyProductionPlanDrafts'],
    queryFn: () => getWeeklyProductionPlanDrafts({ paginated: 'true', currentPage })
  });

  useEffect(() => {
    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (data) return (
    <>
      <h1 className="font-bold text-center text-xl xl:text-left xl:text-4xl">Drafts Planificación Producción</h1>

      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <button
            onClick={() => navigate(`${location.pathname}?newDraftPlanification=true`)}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Iniciar Planificación</p>
          </button>
        </div>
      </div>

      <div className="mt-10 table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Confirmado</th>
              <th className="thead-th">Año</th>
              <th className="thead-th">Semana</th>
              <th className="thead-th">Fecha de Confirmación</th>
              <th className="thead-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map(draft => (
              <tr className="tbody-tr" key={draft.id}>
                <td className="tbody-td">
                  {draft.confirmed ? (
                    <CheckBadgeIcon className="w-6 text-green-500" />
                  ) : (
                    <ClockIcon className="w-6 text-orange-500" />
                  )}
                </td>
                <td className="tbody-td">
                  {draft.year}
                </td>
                <td className="tbody-td">
                  {draft.week}
                </td>
                <td className="tbody-td">
                  {draft.confirmation_date}
                </td>

                <td className="tbody-td">
                  <Link to={`/planificador-produccion/${draft.id}`}>
                    <Eye className="w-12 hover:text-gray-600" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCreateDraftPlanProduction />

      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  )
}
