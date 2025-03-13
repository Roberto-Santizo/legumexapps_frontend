import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlanDetails, LineWeeklyPlan } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import { CircleCheck, Eye, Upload } from "lucide-react";
import ModalCargaPosiciones from "@/components/ModalCargaPosiciones";
import { useState } from "react";

export default function ShowPlanSemanalProduccion() {
  const params = useParams();
  const id = params.plan_id!!;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLinea, setSelectedLinea] = useState<LineWeeklyPlan>({} as LineWeeklyPlan);

  const { data: assignment, isLoading, isError } = useQuery({
    queryKey: ['getWeeklyPlanDetails'],
    queryFn: () => getWeeklyPlanDetails(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  return (
    <div className="w-full">
      <h2 className="font-bold text-3xl mb-10">Lineas Asignadas</h2>

      <div className="p-5 space-y-10">
        {assignment?.map(assigment => (
          <>
            <div key={assigment.id} className="p-10 flex justify-between items-center shadow-xl">
              <p className="text-2xl font-bold">{assigment.line}</p>
              <div>
                {assigment.status ? (
                  <div className="flex flex-col gap-5">
                    <CircleCheck className="text-green-500" />
                    <Link to={`/planes-produccion/${id}/${assigment.id}`}>
                      <Eye className="hover:text-gray-600"/>
                    </Link>
                  </div>
                ) : (
                  <Upload className="cursor-pointer hover:text-gray-500" onClick={() => {
                    setIsOpen(true);
                    setSelectedLinea(assigment)
                  }} />
                )}
              </div>
            </div>
          </>
        ))}
      </div>

      <ModalCargaPosiciones isOpen={isOpen} setIsOpen={setIsOpen} linea={selectedLinea} />
    </div>
  )
}







