import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlanDetails } from "@/api/WeeklyProductionPlanAPI";
import { Eye, Upload } from "lucide-react";
import { useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { LineWeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalCargaPosiciones from "@/components/modals/ModalCargaPosiciones";


export default function ShowPlanSemanalProduccion() {
  const params = useParams();
  const id = params.plan_id!!;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLinea, setSelectedLinea] = useState<LineWeeklyProductionPlan>({} as LineWeeklyProductionPlan);
  const { hasPermission } = usePermissions();

  // const { mutate, isPending } = useMutation({
  //   mutationFn: downloadPlanillaProduction,
  //   onError: (error) => {
  //     toast.error(error.message);
  //   }
  // });

  const { data: assignment, isLoading, isError } = useQuery({
    queryKey: ['getWeeklyPlanDetails', id],
    queryFn: () => getWeeklyPlanDetails(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <div className="w-full">
      {/* {isPending && <LoadingOverlay />} */}
      <h2 className="font-bold text-4xl mb-12 text-gray-800">Líneas Asignadas</h2>

      <div className="space-y-8">
        {assignment?.map(assigment => (
          <div
            key={assigment.id}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-md flex justify-between items-center transition hover:shadow-xl"
          >
            <div className="flex items-center gap-6">
              <p className="text-xl md:text-2xl font-semibold text-gray-800">{assigment.line}</p>
              <span className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm md:text-base shadow-sm">
                {assigment.assigned_employees}/{assigment.total_employees}
              </span>
            </div>

            <div>
              {assigment.status ? (
                <div className="flex items-center gap-4">
                  {hasPermission('see tasks production') && (
                    <Link
                      to={`/planes-produccion/${id}/${assigment.id}`}
                      className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                      title="Ver tareas"
                    >
                      <Eye className="text-gray-700 w-6 h-6" />
                    </Link>
                  )}
                  {/* 
                  {hasPermission('download hours line report') && (
                    <button
                      onClick={() => mutate({ plan_id: id, line_id: assigment.id })}
                      className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                      title="Descargar reporte"
                    >
                      <FileDown className="text-gray-700 w-6 h-6" />
                    </button>
                  )} */}
                </div>
              ) : (
                <>
                  {hasPermission('assign people production lines') && (
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setSelectedLinea(assigment);
                      }}
                      className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition"
                      title="Asignar"
                    >
                      <Upload className="text-blue-600 w-6 h-6" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ModalCargaPosiciones
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        linea={selectedLinea}
      />
    </div>

  )
}







