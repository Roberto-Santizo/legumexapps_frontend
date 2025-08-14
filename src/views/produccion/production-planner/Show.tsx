import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { DownloadIcon, PlusIcon } from "lucide-react";
import { confirmPlan, createWeeklyProductionPlanFromDraft, getDraftWeeklyPlanById } from "@/api/DraftWeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { usePlanificationWebSocket } from "@/lib/echo";
import { downloadWeeklyProductionDraftTasks } from "@/api/WeeklyProductionPlanAPI";
import ModalAddNewDraftProductionTask from "@/components/modals/ModalAddNewDraftProductionTask";
import SummaryLines from "./SummaryLines";
import SummaryItems from "./SummaryItems";
import ModalEditTaskProductionDraft from "@/components/modals/ModalEditTaskProductionDraft";
import SummaryItemsRawMaterial from "./SummaryItemsRawMaterial";
import Spinner from "@/components/utilities-components/Spinner";
import Swal from "sweetalert2";
import TasksList from "./TasksList";
import "@/lib/echo";

export type FiltersDraftsTasks = {
  sku: string;
  product: string;
  line: string;
}

const FiltersIntialValues: FiltersDraftsTasks = {
  sku: '',
  product: '',
  line: ''
}

export default function Show() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const [filters, setFilters] = useState<FiltersDraftsTasks>(FiltersIntialValues);

  const navigate = useNavigate();

  const { data: draft } = useQuery({
    queryKey: ['getDraftWeeklyPlanById', id, filters],
    queryFn: () => getDraftWeeklyPlanById({ id, filters }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  });

  usePlanificationWebSocket(id);

  const { mutate: confirmPlanMutation } = useMutation({
    mutationFn: confirmPlan,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    }
  });

  const { mutate: createWeeklyProductionPlan, isPending } = useMutation({
    mutationFn: createWeeklyProductionPlanFromDraft,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    }
  });

  const { mutate: dowloadTasks, isPending: dowloadTasksLoading } = useMutation({
    mutationFn: downloadWeeklyProductionDraftTasks,
    onError: (error) => {
      toast.error(error.message);
    }
  });


  const handleChangefiltersNoOperationDate = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  }

  const flag = useMemo(() => !(draft && draft.logistics_confirmation && draft.bodega_confirmation && draft.production_confirmation), [draft]);

  const handleConfirmPlan = () => {
    Swal.fire({
      title: "¿Estas seguro que quieres confirmar?",
      showDenyButton: true,
      confirmButtonText: "Confirmar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        confirmPlanMutation({ id });
      }
    });
  }

  if (draft) return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-gray-50">
      <div className="lg:col-span-3 space-y-6">
        <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-gray-700">
            <p><span className="font-medium">Semana:</span> {draft.week}</p>
            <p><span className="font-medium">Año:</span> {draft.year}</p>
            <p><span className="font-medium">Fecha de confirmación:</span> {draft.confirmation_date ?? 'No confirmado'}</p>
            <p><span className="font-medium">Aprobación producción:</span> {draft.production_confirmation ? 'Confirmado' : 'No confirmado'}</p>
            <p><span className="font-medium">Aprobación bodega:</span> {draft.bodega_confirmation ? 'Confirmado' : 'No confirmado'}</p>
            <p><span className="font-medium">Aprobación logística:</span> {draft.logistics_confirmation ? 'Confirmado' : 'No confirmado'}</p>
          </div>

          {(flag && draft.flag_tasks) && (
            <button className="button bg-orange-500 hover:bg-orange-700 w-full" onClick={() => handleConfirmPlan()}>
              Confirmar
            </button>
          )}
        </section>

        <SummaryLines setFilters={setFilters} filters={filters} />
        <SummaryItems filters={filters} />
        <SummaryItemsRawMaterial filters={filters} />
      </div>

      <aside className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-start-4 overflow-y-auto scrollbar-hide flex flex-col space-y-6 max-h-screen">
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
          <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200 space-y-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="sku" className="block text-sm font-semibold text-gray-700">SKU</label>
                <input
                  id="sku"
                  type="text"
                  placeholder="Ingrese SKU"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChangefiltersNoOperationDate(e)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="product" className="block text-sm font-semibold text-gray-700">Producto</label>
                <input
                  id="product"
                  type="text"
                  placeholder="Ingrese nombre del producto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChangefiltersNoOperationDate(e)}
                  autoComplete="off"
                />
              </div>
            </div>

            {!draft.confirmation_date && (
              <>
                <button
                  onClick={() => navigate(`${location.pathname}?newTask=true`, { replace: true })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Crear Tarea</span>
                </button>
              </>
            )}

            <button
              disabled={dowloadTasksLoading}
              onClick={() => dowloadTasks({ plan_id: id })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
            >
              {dowloadTasksLoading ? <Spinner /> : (
                <DownloadIcon className="w-4 h-4" />

              )}
              <span>Descargar Tareas</span>
            </button>
          </div>

          {draft.tasks.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No existen tareas cargadas</p>
          ) : (
            <TasksList draft={draft} />
          )}
        </div>
      </aside>

      {!draft.plan_created && (
        <button
          onClick={() => createWeeklyProductionPlan(id)}
          disabled={flag || isPending}
          className={`button col-span-4 text-white font-semibold py-2 px-4 rounded transition duration-300
            ${flag
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'}
          `}
        >
          {isPending ? <Spinner /> : <p>Crear Planificación semanal</p>}
        </button>
      )}

      <ModalAddNewDraftProductionTask />
      <ModalEditTaskProductionDraft />
    </div>
  )
}
