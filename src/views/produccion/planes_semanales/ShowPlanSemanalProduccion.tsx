import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlanDetails } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function ShowPlanSemanalProduccion() {
  const params = useParams();
  const id = params.plan_id!!;

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
          <div key={assigment.id} className="p-5 grid grid-cols-8 shadow-xl">
            <p className="col-span-7 text-2xl font-bold">{assigment.line}</p>
            <div>
                optiones
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}







