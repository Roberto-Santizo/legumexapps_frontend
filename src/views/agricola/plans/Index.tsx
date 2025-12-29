import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, PlusIcon, UploadIcon } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";

import { getWeeklyPlans } from "@/api/WeeklyPlansAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { WeeklyPlan } from "@/types/planificacionFincasType";

import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import MenuColumns from "@/components/planes-semanales-finca/MenuColumns";
import ActionsColumns from "@/components/planes-semanales-finca/ActionsColumns";
import BudgetColumns from "@/components/planes-semanales-finca/BudgetColumns";
import FiltersPlanSemanalFinca from "@/components/filters/FiltersPlanSemanalFinca";
import ModalUploadAgricolaAssignments from "@/components/modals/ModalUploadAgricolaAssignments";

export type FiltersPlanSemanalType = {
  finca_id: string;
  week: string;
  year: string;
};

export const FiltersPlanSemanalInitialValues: FiltersPlanSemanalType = {
  finca_id: "",
  week: "",
  year: "",
};

export default function Index() {
  const [selectingReport, setSelectingReport] = useState(false);
  const [plansId, setPlansId] = useState<WeeklyPlan["id"][]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(FiltersPlanSemanalInitialValues);
  const [tempFilters, setTempFilters] = useState(FiltersPlanSemanalInitialValues);

  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedPlans", currentPage, filters],
    queryFn: () =>
      getWeeklyPlans({
        page: currentPage,
        filters,
        paginated: "true",
      }),
  });

  useEffect(() => {
    if (!data) return;

    setWeeklyPlans(data.data);

    if (data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const togglePlanSelection = (id: WeeklyPlan["id"]) => {
    setSelectingReport(true);

    setPlansId((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];

      if (updated.length === 0) setSelectingReport(false);
      return updated;
    });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <header className="mb-8 flex flex-col gap-6 rounded-xl bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 xl:text-4xl">
            Planes Semanales
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => navigate("?upload=true")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <UploadIcon className="h-5 w-5" />
            Cargar Asignaciones
          </button>
          {hasPermission("create plan semanal") && (
            <>
              <Link
                to="/planes-semanales/crear"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="h-5 w-5" />
                Crear Plan
              </Link>

              {hasPermission("filter plan semanal") && (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Filtrar planes"
                >
                  <Bars3Icon className="h-5 w-5" />
                </button>
              )}
            </>
          )}

        </div>
      </header>


      {weeklyPlans.length === 0 ? (
        <p className="mt-10 text-center text-xl text-gray-500">
          No existen planes semanales
        </p>
      ) : (
        <section className="table-wrapper">
          <table className="table mt-10">
            <thead>
              <tr className="thead-tr">
                {selectingReport && <th className="thead-th" />}
                <th className="thead-th">Finca</th>
                <th className="thead-th">Semana</th>
                <th className="thead-th">Año</th>
                <th className="thead-th">Control de Presupuesto</th>
                <th className="thead-th">Monto Extraordinario</th>
                <th className="thead-th">Control de Tareas</th>
                <th className="thead-th">Tareas Cosecha</th>
                <th className="thead-th">Acciones</th>
                <th className="thead-th text-center" />
              </tr>
            </thead>

            <tbody className="text-sm">
              {weeklyPlans.map((plan) => (
                <tr key={plan.id} className="tbody-tr">
                  {selectingReport && (
                    <td className="p-5">
                      {plansId.includes(plan.id) && (
                        <CheckCircle
                          onClick={() => togglePlanSelection(plan.id)}
                          className="cursor-pointer text-green-600 transition hover:text-green-800"
                        />
                      )}
                    </td>
                  )}

                  <td className="tbody-td">{plan.finca}</td>
                  <td className="tbody-td">{plan.week}</td>
                  <td className="tbody-td">{plan.year}</td>

                  <BudgetColumns plan={plan} />

                  <td className="tbody-td">
                    {plan.finished_total_tasks}/{plan.total_tasks}
                  </td>
                  <td className="tbody-td">
                    {plan.finished_total_tasks_crops}/{plan.total_tasks_crop}
                  </td>

                  <ActionsColumns plan={plan} />
                  <MenuColumns plan={plan} />
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {isOpen && (
        <FiltersPlanSemanalFinca
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setFilters={setFilters}
          tempFilters={tempFilters}
          setTempFilters={setTempFilters}
        />
      )}

      <footer className="mb-10 mt-6 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </footer>

      <ModalUploadAgricolaAssignments />
    </>
  );
}
