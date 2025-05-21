import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, Download, PlusIcon, XIcon } from "lucide-react";
import { toast } from "react-toastify";
import { downloadWeeklyPlanReport, getWeeklyPlans } from "@/api/WeeklyPlansAPI";
import { WeeklyPlan } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { Bars3Icon } from "@heroicons/react/16/solid";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InsumosColumns from "@/components/planes-semanales-finca/InsumosColumns";
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

export default function IndexPlanSemanal() {
  const [selectingReport, setSelectingReport] = useState<boolean>(false);
  const [plansId, setPlansId] = useState<WeeklyPlan["id"][]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersPlanSemanalType>(FiltersPlanSemanalInitialValues);
  const [tempFilters, setTempFilters] = useState<FiltersPlanSemanalType>(FiltersPlanSemanalInitialValues);
  const { hasPermission } = usePermissions();

  const { mutate: handleDowloadReportMutation, isPending: handleDowloadReportMutationPending } = useMutation({
    mutationFn: ({ plansId }: { plansId: WeeklyPlan['id'][] }) => downloadWeeklyPlanReport(plansId),
    onError: () => {
      toast.error('Hubo un error al descargar')
    },
    onSuccess: () => {
      setSelectingReport(false);
      setPlansId([]);
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPaginatedPlans', currentPage, filters],
    queryFn: () => getWeeklyPlans({ page: currentPage, filters: filters, paginated: '' }),
  });

  useEffect(() => {
    if (data) {
      setWeeklyPlans(data.data);
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

  const handleDowloadReport = async ({ plansId }: { plansId: WeeklyPlan['id'][] }) => { handleDowloadReportMutation({ plansId }) };

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />;
  return (
    <>
      <h2 className="font-bold text-4xl">Planes Semanales</h2>
      {hasPermission('create plan semanal') && (
        <div className="flex flex-row justify-end gap-5 mb-5">
          <Link
            to="/planes-semanales/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Plan Semanal</p>
          </Link>

          <Link
            to="/planes-semanales/tareas-lote/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear Actividad</p>
          </Link>

          {hasPermission('filter plan semanal') && (
            <Bars3Icon
              className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      )}


      {selectingReport && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex justify-end gap-5"
        >
          <button
            className="button bg-green-500 hover:bg-green-700 flex gap-2"
            onClick={() => handleDowloadReport({ plansId })}
            disabled={handleDowloadReportMutationPending}
          >
            {handleDowloadReportMutationPending ? (
              <Spinner />
            ) : (
              <>
                <p>Descargar Reportes</p>
                <Download className="hover:text-gray-400 cursor-pointer" />
              </>
            )}
          </button>
          <div
            className="button bg-red-500 hover:bg-red-700 flex gap-2"
            onClick={() => {
              setSelectingReport(false);
              setPlansId([]);
            }}
          >
            <XIcon className="hover:text-red-500 cursor-pointer" />
            <p>Cancelar</p>
          </div>
        </motion.div>
      )}

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            {selectingReport && <th scope="col" className="thead-th"></th>}

            <th scope="col" className="thead-th">
              Finca
            </th>
            <th scope="col" className="thead-th">
              Semana
            </th>
            <th scope="col" className="thead-th">
              Año
            </th>
            <th scope="col" className="thead-th">
              Control de Presupuesto
            </th>
            <th scope="col" className="thead-th">
              Monto Extraordinario
            </th>
            <th scope="col" className="thead-th">
              Control de Tareas
            </th>
            <th scope="col" className="thead-th">
              Control de tareas Cosecha
            </th>
            <th scope="col" className="thead-th">
              Acciones
            </th>
            <th scope="col" className="thead-th">
              Reporte de Insumos
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {weeklyPlans.map((plan) => (
            <tr
              className="tbody-tr"
              key={plan.id}
              onDoubleClick={() => handleDobleClick(plan.id)}
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

              <InsumosColumns planId={plan.id} />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>

      {isOpen && (
        <FiltersPlanSemanalFinca isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}
    </>
  );
}
