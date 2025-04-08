import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { getFinishedTasksByFinca } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import "react-circular-progressbar/dist/styles.css";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";

export default function SummaryTasksFincas() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getFinishedTasksByFinca'],
    queryFn: getFinishedTasksByFinca
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (data) return (
    <div className="flex flex-col items-center shadow-xl row-start-1 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de Tareas Finca
      </p>

      <div className="flex gap-5 p-10 justify-between w-full">
        {data.map((data) => (
          <div className="flex flex-col justify-between items-center gap-5" key={data.id}>
            <CircularProgressbar
              className="w-32"
              value={data.percentage}
              styles={buildStyles({
                pathColor: "#3B82F6",
                trailColor: "#F5F5F5",
                textSize: 15
              })}
              text={`${data.finished_tasks}/${data.total_tasks}`}
            />
            <p className="font-bold">{data.finca}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
