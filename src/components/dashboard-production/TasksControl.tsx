import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useQuery } from "@tanstack/react-query";
import { GetSummaryTasksPerLine } from "@/api/DashboardProductionAPI";

export default function TasksControl() {
  const { data } = useQuery({
    queryKey: ["GetSummaryTasksPerLine"],
    queryFn: GetSummaryTasksPerLine,
  });

  if (data) return (
    <div className="flex flex-col items-center shadow-xl row-start-1 col-start-1 col-span-12 rounded-xl gap-10">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        Control de Tareas Producción
      </p>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex flex-nowrap gap-6 sm:gap-8 md:gap-10 p-4 sm:p-6 md:p-10">
          {data.map((item) => (
            <div
              key={item.line}
              className="flex flex-col justify-between items-center gap-2 sm:gap-3"
            >
              <div className="w-20 sm:w-24 md:w-32">
                <CircularProgressbar
                  value={item.percentage * 100}
                  text={`${item.finished_tasks}/${item.total_tasks}`}
                  styles={buildStyles({
                    pathColor: "#3B82F6",
                    trailColor: "#F5F5F5",
                    textSize: "16px",
                  })}
                />
              </div>
              <p className="font-bold text-[10px] sm:text-xs md:text-sm text-center whitespace-nowrap">
                {item.line}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
