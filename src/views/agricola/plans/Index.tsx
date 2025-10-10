import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, PlusIcon } from "lucide-react";
import { getWeeklyPlans } from "@/api/WeeklyPlansAPI";
import { useQuery } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { WeeklyPlan } from "@/types/planificacionFincasType";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import MenuColumns from "@/components/planes-semanales-finca/MenuColumns";
import ActionsColumns from "@/components/planes-semanales-finca/ActionsColumns";
import BudgetColumns from "@/components/planes-semanales-finca/BudgetColumns";
import FiltersPlanSemanalFinca from "@/components/filters/FiltersPlanSemanalFinca";

export type FiltersPlanSemanalType = {
  finca_id: string;
  week: string;
  year: string;
}

export const FiltersPlanSemanalInitialValues: FiltersPlanSemanalType = {
  finca_id: "",
  week: "",
  year: ""
}

export default function Index() {
  const [selectingReport, setSelectingReport] = useState<boolean>(false);
  const [plansId, setPlansId] = useState<WeeklyPlan["id"][]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersPlanSemanalType>(FiltersPlanSemanalInitialValues);
  const [tempFilters, setTempFilters] = useState<FiltersPlanSemanalType>(FiltersPlanSemanalInitialValues);
  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedPlans', currentPage, filters],
    queryFn: () => getWeeklyPlans({ page: currentPage, filters: filters, paginated: 'true' }),
  });

  useEffect(() => {
    if (data) {
      setWeeklyPlans(data.data);
    }

    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data])


  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleDobleClick = (id: WeeklyPlan["id"]) => {
    setSelectingReport(true);

    setPlansId((prev) => {
      const updatedPlans = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];

      if (updatedPlans.length === 0) {
        setSelectingReport(false);
      }

      return updatedPlans;
    });
  };

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />;
  return (
    <>
      <h2 className="font-bold text-xl text-center xl:text-4xl xl:text-left">Planes Semanales</h2>

      {hasPermission('create plan semanal') && (
        <div className="flex xl:flex-row flex-col justify-end xl:gap-5 mb-5 space-y-5">
          <Link
            to="/planes-semanales/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Plan Semanal</p>
          </Link>

          <Link
            to="/planes-semanales/tareas-lote/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Actividad</p>
          </Link>

          {hasPermission('filter plan semanal') && (
            <div className="flex justify-end">
              <Bars3Icon
                className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
                onClick={() => setIsOpen(true)}
              />
            </div>
          )}
        </div>
      )}

      {weeklyPlans.length === 0 ? <p className="text-center text-xl text-gray-500">No existen planes semanales</p> : (
        <div className="table-wrapper">
          <table className="table mt-10">
            <thead>
              <tr className="thead-tr">
                {selectingReport && <th scope="col" className="thead-th"></th>}
                <th className="thead-th">
                  Finca
                </th>
                <th className="thead-th">
                  Semana
                </th>
                <th className="thead-th">
                  Año
                </th>
                <th className="thead-th">
                  Control de Presupuesto
                </th>
                <th className="thead-th">
                  Monto Extraordinario
                </th>
                <th className="thead-th">
                  Control de Tareas
                </th>
                <th className="thead-th">
                  Control de tareas Cosecha
                </th>
                <th className="thead-th">
                  Acciones
                </th>
                <th className="thead-th text-center">
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {weeklyPlans.map((plan) => (
                <tr
                  className="tbody-tr"
                  key={plan.id}
                >
                  {selectingReport && (
                    <td className="p-5">
                      {plansId.some((p) => p === plan.id) && (
                        <CheckCircle
                          className="text-green-600 cursor-pointer hover:text-green-800"
                          onClick={() => handleDobleClick(plan.id)}
                        />
                      )}
                    </td>
                  )}
                  <td className="tbody-td">{plan.finca}</td>
                  <td className="tbody-td">{plan.week}</td>
                  <td className="tbody-td">{plan.year}</td>

                  <BudgetColumns plan={plan} />

                  <td className="tbody-td">
                    {`${plan.finished_total_tasks}/${plan.total_tasks}`}
                  </td>
                  <td className="tbody-td">{`${plan.finished_total_tasks_crops}/${plan.total_tasks_crop}`}</td>

                  <ActionsColumns plan={plan} />

                  <MenuColumns plan={plan} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {isOpen && (
        <FiltersPlanSemanalFinca isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}

      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
}
