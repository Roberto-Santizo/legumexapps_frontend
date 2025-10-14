import { useState } from "react";
import { Search } from "lucide-react";
import { getFincas, getLotesByFincaId } from "@/api/FincasAPI";
import { getAllCdpsByLoteId } from "@/api/LotesAPI";
import { useQuery } from "@tanstack/react-query";
import { getCDPInfoByCDPId } from "@/api/PlantationControlAPI";
import Spinner from "@/components/utilities-components/Spinner";
import LoteDetails from "@/components/consulta-lote/LoteDetails";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Details() {
  const [selectedFincaId, setSelectedFincaId] = useState<string>("");
  const [selectedLoteId, setSelectedLoteId] = useState<string>("");
  const [selectedCdpId, setSelectedCdpId] = useState<string>("");
  const notify = useNotification();

  const { data: fincas } = useQuery({
    queryKey: ['getAllFincas'],
    queryFn: getFincas,
  });

  const fincasFilter = fincas?.filter((finca) => +finca.id < 7);

  const { data: lotes } = useQuery({
    queryKey: ['getAllLotesByFincaId', selectedFincaId],
    queryFn: () => getLotesByFincaId(selectedFincaId),
    enabled: !!selectedFincaId,
  });

  const { data: cdps } = useQuery({
    queryKey: ['getAllCdpsByLoteId', selectedLoteId],
    queryFn: () => getAllCdpsByLoteId(selectedLoteId),
    enabled: !!selectedLoteId,
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['getCDPInfoByCDPId', selectedCdpId],
    queryFn: () => getCDPInfoByCDPId(selectedCdpId),
    enabled: false,
  });

  const searchInfo = async () => {
    if (!selectedCdpId) {
      notify.error("El CDP es necesario para la búsqueda");
      return;
    }
    refetch();
  };

  return (
    <div className="mb-10">
      <h2 className="font-bold text-4xl">Consulta de lote</h2>

      <div className="mt-5 p-5 flex flex-wrap gap-5 items-center bg-white shadow-lg rounded-xl justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-lg font-bold uppercase text-gray-700" htmlFor="finca_id">
              Finca:
            </label>
            <select
              id="finca_id"
              name="finca_id"
              value={selectedFincaId}
              onChange={(e) => {
                setSelectedFincaId(e.target.value);
                setSelectedLoteId("");
                setSelectedCdpId("");
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {fincasFilter?.map((finca) => (
                <option key={finca.id} value={finca.id}>
                  {finca.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-lg font-bold uppercase text-gray-700" htmlFor="lote_id">
              Lotes:
            </label>
            <select
              id="lote_id"
              name="lote_id"
              value={selectedLoteId}
              onChange={(e) => {
                setSelectedLoteId(e.target.value);
                setSelectedCdpId("");
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
              disabled={!selectedFincaId}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {lotes?.map((lote) => (
                <option key={lote.id} value={lote.id}>
                  {lote.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-lg font-bold uppercase text-gray-700" htmlFor="cdp_id">
              CDPs:
            </label>
            <select
              id="cdp_id"
              name="cdp_id"
              value={selectedCdpId}
              onChange={(e) => setSelectedCdpId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
              disabled={!selectedLoteId}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {cdps?.map((cdp) => (
                <option key={cdp.id} value={cdp.id}>
                  {cdp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={searchInfo}
        >
          {isLoading ? <Spinner /> : <Search />}
        </button>
      </div>

      {data && <LoteDetails data={data} />}
    </div>
  );
}
