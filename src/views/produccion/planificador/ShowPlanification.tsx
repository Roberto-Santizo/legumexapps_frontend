import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { confirmPlan, createWeeklyProductionPlanFromDraft, getDraftWeeklyPlanById, uploadTasksProductionDrafts } from "@/api/DraftWeeklyProductionPlanAPI";
import { deleteTaskProductionDraft } from "@/api/DraftTaskProductionDraftAPI";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import ModalAddNewDraftProductionTask from "@/components/modals/ModalAddNewDraftProductionTask";
import SummaryLines from "./SummaryLines";
import SummaryItems from "./SummaryItems";
import ModalEditTaskProductionDraft from "@/components/modals/ModalEditTaskProductionDraft";
import SummaryItemsRawMaterial from "./SummaryItemsRawMaterial";
import Spinner from "@/components/utilities-components/Spinner";
import Swal from "sweetalert2";
import "@/lib/echo";


export default function ShowPlanification() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const queryClient = useQueryClient();
  const [file] = useState<File[] | null>(null);

  const navigate = useNavigate();

  const { data: draft } = useQuery({
    queryKey: ['getDraftWeeklyPlanById', id],
    queryFn: () => getDraftWeeklyPlanById(id),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (window.Echo) {
      window.Echo.private(`planification.change`).listen('.UpdateProductionPlanification', () => {
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftLines', id] });
        queryClient.invalidateQueries({ queryKey: ['getDraftWeeklyPlanById', id] });
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftItems', id] });
        queryClient.invalidateQueries({ queryKey: ['getSummaryDraftRawMaterial', id] });
      });
    }
  }, []);

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

  const { mutate } = useMutation({
    mutationFn: deleteTaskProductionDraft,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    }
  });

  const { mutate: uploadtasks } = useMutation({
    mutationFn: uploadTasksProductionDrafts,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      uploadtasks({ file: acceptedFiles, id });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen gap-6 p-6 bg-gray-50">
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

          {flag && (
            <button className="button bg-orange-500 hover:bg-orange-700 w-full" onClick={() => handleConfirmPlan()}>
              Confirmar
            </button>
          )}
        </section>

        <SummaryLines />

        <SummaryItems />
        <SummaryItemsRawMaterial />
      </div>

      <aside className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-start-4 h-screen overflow-y-auto scrollbar-hide flex flex-col space-y-6">
        {!draft.confirmation_date && (
          <>
            <button
              onClick={() => navigate(`${location.pathname}?newTask=true`, { replace: true })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Crear Tarea</span>
            </button>

            <div className="bg-gray-50 shadow-inner rounded-xl p-6 text-sm">
              <form>
                <div
                  {...getRootProps()}
                  className={`transition-all duration-200 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
                ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300 hover:border-blue-400'}
                ${file ? 'border-green-400 bg-green-50' : ''}`}
                >
                  <input {...getInputProps()} disabled={!!file} />
                  {file ? (
                    <p className="text-green-700 font-medium truncate">Archivo: {file[0].name}</p>
                  ) : isDragActive ? (
                    <p className="text-blue-600 font-semibold uppercase">Suelta el archivo aquí</p>
                  ) : (
                    <p className="text-gray-500 font-semibold uppercase">Arrastra o haz clic para subir</p>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        <h2 className="text-xl font-bold text-gray-800 text-center">Tareas</h2>

        <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
          {draft.tasks.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No existen tareas cargadas</p>
          ) : (
            <ul className="space-y-4">
              {draft.tasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition"
                >
                  {!draft.confirmation_date && (
                    <div className="flex justify-end gap-2 mb-2">
                      <EditIcon onClick={() => navigate(`${location.pathname}?editDraftTask=${task.id}`)} className="cursor-pointer hover:text-indigo-500" size={18} />
                      <TrashIcon
                        onClick={() => mutate({ id: task.id })}
                        className="cursor-pointer hover:text-red-500"
                        size={18}
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Línea</p>
                      <p className="text-gray-800 font-medium">{task.line}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">SKU</p>
                      <p className="text-gray-800 font-medium">{task.sku}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Cajas Totales</p>
                      <p className="text-gray-800 font-medium">{task.total_boxes}</p>
                    </div>

                    <div>
                      <p className="text-gray-500">Destino</p>
                      <p className="text-gray-800 font-medium">{task.destination}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {!draft.plan_created && (
        <button
          onClick={() => createWeeklyProductionPlan(id)}
          disabled={flag || isPending}
          className={`button col-span-3 text-white font-semibold py-2 px-4 rounded transition duration-300
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
