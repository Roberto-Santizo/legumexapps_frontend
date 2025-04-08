import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion } from "framer-motion";
import { downloadReportInsumos, getPaginatedPlans } from "@/api/WeeklyPlansAPI";
import { Link } from "react-router-dom";
import { CheckCircle, Download, PlusIcon, Sheet, XIcon } from "lucide-react";
import { toast } from "react-toastify";
import { downloadWeeklyPlanReport } from "@/api/WeeklyPlansAPI";
import { WeeklyPlan } from "@/types";
import { formatearQuetzales } from "@/helpers";
import { useQueries, useMutation } from "@tanstack/react-query";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import LoadingOverlay from "@/components/utilities-components/LoadingOverlay";

export default function IndexPlanSemanal() {
  const [selectingReport, setSelectingReport] = useState<boolean>(false);
  const [plansId, setPlansId] = useState<WeeklyPlan["id"][]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<string>("");
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const canSeeBudgetRoles = ['admin', 'adminagricola'];
  const canCreatePlanSemanalRoles = ['admin', 'adminagricola'];
  const canSeeBudget = canSeeBudgetRoles.includes(role);
  const canCreatePlanSemanal = canCreatePlanSemanalRoles.includes(role);

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

  const { mutate: HandleDownloadReportInsumosMutation, isPending: HandleDownloadReportInsumosPending } = useMutation({
    mutationFn: ({ planId }: { planId: WeeklyPlan['id'] }) => downloadReportInsumos(planId),
    onError: () => {
      toast.error('Hubo un error al descargar')
    }
  });

  const results = useQueries({
    queries: [
      { queryKey: ['getUserRoleByToken'], queryFn: getUserRoleByToken },
      { queryKey: ['getPaginatedPlans', currentPage], queryFn: () => getPaginatedPlans(currentPage) }
    ]
  });

  const isLoading = results.every(query => query.isLoading);

  useEffect(() => {
    if (results[0].data) setRole(results[0].data);
    if (results[1].data) {
      setWeeklyPlans(results[1].data.data);
      setPageCount(results[1].data.meta.last_page);
      setCurrentPage(results[1].data.meta.current_page);
    }
  }, [results])


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
  const handleDownloadInsumosReport = async (planId: WeeklyPlan['id']) => { HandleDownloadReportInsumosMutation({ planId }) };

  if (isLoading) return <Spinner />
  return (
    <>
      <h2 className="font-bold text-4xl">Planes Semanales</h2>
      {HandleDownloadReportInsumosPending && <LoadingOverlay />}
      {canCreatePlanSemanal && (
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
            {canSeeBudget && (
              <>
                <th scope="col" className="thead-th">
                  Control de Presupuesto
                </th>
                <th scope="col" className="thead-th">
                  Monto Extraordinario
                </th>
              </>
            )}
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
              {canSeeBudget && (
                <>
                  <td className="tbody-td font-bold text-green-500">
                    {`${formatearQuetzales(plan.used_budget)}/${formatearQuetzales(plan.total_budget)}`}
                  </td>
                  <td className="tbody-td font-bold text-green-500">
                    {`${formatearQuetzales(plan.used_total_budget_ext)}/${formatearQuetzales(plan.total_budget_ext)}`}
                  </td>
                </>
              )}
              <td className="tbody-td">
                {`${plan.finished_total_tasks}/${plan.total_tasks}`}
              </td>
              <td className="tbody-td">{`${plan.finished_total_tasks_crops}/${plan.total_tasks_crop}`}</td>
              <td className="tbody-td w-1/5">
                <Link
                  to={`/planes-semanales/${plan.finca}/${plan.id}`}
                  className={`button flex justify-center w-2/3 bg-indigo-500 hover:bg-indigo-600 text-base rounded-lg`}
                >
                  Tareas
                </Link>
              </td>
              <td className="tbody-td">
                <button
                  onClick={() => handleDownloadInsumosReport(plan.id)}
                >
                  <Sheet className="hover:text-gray-400" />
                </button>
              </td>
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
    </>
  );
}
