import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { downloadPlanillaProduction, getWeeklyPlanDetails, LineWeeklyPlan } from "@/api/WeeklyProductionPlanAPI";
import { CircleCheck, Eye, FileDown, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import ModalCargaPosiciones from "@/components/ModalCargaPosiciones";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function ShowPlanSemanalProduccion() {
  const params = useParams();
  const id = params.plan_id!!;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLinea, setSelectedLinea] = useState<LineWeeklyPlan>({} as LineWeeklyPlan);

  const { mutate, isPending } = useMutation({
    mutationFn: downloadPlanillaProduction,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { data: assignment, isLoading, isError, refetch } = useQuery({
    queryKey: ['getWeeklyPlanDetails'],
    queryFn: () => getWeeklyPlanDetails(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <div className="w-full">
      {isPending && <LoadingOverlay />}
      <h2 className="font-bold text-3xl mb-10">Lineas Asignadas</h2>

      <div className="p-5 space-y-10">
        {assignment?.map(assigment => (
          <div key={assigment.id} className="p-10 flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-5">
              <p className="text-2xl font-bold">{assigment.line}</p>
              <p className="bg-orange-500 p-3 text-white font-bold rounded text-lg">{assigment.assigned_employees}/{assigment.total_employees}</p>
            </div>
            <div>
              {assigment.status ? (
                <div className="flex flex-col gap-5">
                  <CircleCheck className="text-green-500" />
                  <Link to={`/planes-produccion/${id}/${assigment.id}`}>
                    <Eye className="hover:text-gray-600" />
                  </Link>
                  <FileDown className="hover:text-gray-600 cursor-pointer" onClick={() => mutate({ plan_id: id, line_id: assigment.id })} />
                </div>
              ) : (
                <Upload className="cursor-pointer hover:text-gray-500" onClick={() => {
                  setIsOpen(true);
                  setSelectedLinea(assigment)
                }} />
              )}
            </div>
          </div>
        ))}
      </div>

      <ModalCargaPosiciones isOpen={isOpen} setIsOpen={setIsOpen} linea={selectedLinea} refetch={refetch} />
    </div>
  )
}







