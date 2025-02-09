import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import { SummaryFincaTasks } from "../../types";
import Spinner from "../Spinner";
import "react-circular-progressbar/dist/styles.css";

export default function SummaryTasksFincas() {
  const getFinishedTasksByFinca = useAppStore(
    (state) => state.getFinishedTasksByFinca
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<SummaryFincaTasks[]>([]);
  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const data = await getFinishedTasksByFinca();
      setData(data);
    } catch (error) {
      toast.error("Hubo un error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <div className="flex flex-col items-center shadow-xl row-start-1 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de Tareas Finca
      </p>

      {loading && <Spinner />}
      {!loading && (
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
      )}
    </div>
  );
}
