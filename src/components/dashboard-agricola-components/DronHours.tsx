import { useEffect, useState } from "react";
import DronIcon from "../DronIcon";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

type Props = {
  permission: string;
};
export default function DronHours({ permission }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [dronHours, setDronHours] = useState<number>(0);
  const getDronHours = useAppStore((state) => state.getDronHours);

  const handleGetDronHours = async () => {
    setLoading(true);
    try {
      const hours = await getDronHours(permission);
      setDronHours(hours);
    } catch (error) {
      toast.error("Error al obtener información del dron");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDronHours();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center shadow-xl row-start-2 col-start-1 col-span-5 rounded-xl">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Horas Dron Semanal
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="h-full flex justify-center items-center flex-col">
            <DronIcon width={120} height={150} />
            <p className="text-2xl font-bold mb-5">{dronHours} Horas</p>
          </div>
        </>
      )}
    </div>
  );
}
