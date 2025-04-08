import DronIcon from "./DronIcon";
import Spinner from "../utilities-components/Spinner";
import { getDronHours } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";

export default function DronHours() {

  const { data: dronHours, isLoading, isError } = useQuery({
    queryKey: ['getDronHours'],
    queryFn: getDronHours
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  return (
    <div className="flex flex-col items-center justify-center shadow-xl row-start-2 col-start-1 col-span-5 rounded-xl">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Horas Dron Semanal
      </p>
      <div className="h-full flex justify-center items-center flex-col">
        <DronIcon width={120} height={150} />
        <p className="text-2xl font-bold mb-5">{dronHours ?? 0} Horas</p>
      </div>
    </div>
  );
}
