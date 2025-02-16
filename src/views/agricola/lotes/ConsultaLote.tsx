import { ChangeEvent, useEffect, useState } from "react";
import { CDP, Finca, loteCDPDetails } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import { Lote } from "../../../types";
import TaskLabel from "../../../components/TaskLabel";
import { formatDate } from "../../../helpers";
import { EyeIcon, Search } from "lucide-react";

export default function ConsultaLote() {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cdps, setCDPS] = useState<CDP[]>([]);
  const [search, setSearch] = useState({
    cdp_id: "",
    lote_id: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<loteCDPDetails>({} as loteCDPDetails);
  const fetchFincas = useAppStore((state) => state.fetchFincas);
  const fetchAllLotesByFincaId = useAppStore(
    (state) => state.fetchAllLotesByFincaId
  );
  const fetchAllCdpsByLoteId = useAppStore(
    (state) => state.fetchAllCdpsByLoteId
  );

  const fetchCDPInfo = useAppStore((state) => state.fetchCDPInfo);

  const handleGetFincas = async () => {
    setLoading(true);
    try {
      const fincas = await fetchFincas();
      setFincas(fincas);
    } catch (error) {
      toast.error("Error al trear fincas, intentelo de nuevo más tarde");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLotes = async (id: string) => {
    setLoading(true);
    try {
      const lotes = await fetchAllLotesByFincaId(id);
      setLotes(lotes);
    } catch (error) {
      toast.error(
        "Existe un error al cargar los lotes, vuelve a intenterlo más tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetCDPS = async (id: Lote["id"]) => {
    setLoading(true);
    try {
      const cdps = await fetchAllCdpsByLoteId(id);
      setCDPS(cdps);
    } catch (error) {
      toast.error(
        "Hubo un error al traer los CDPS, intentelo de nuevo más tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFincas();
  }, []);

  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    setData({} as loteCDPDetails);
    if (e.target.name === "finca_id") {
      handleGetLotes(e.target.value);
    }
    if (e.target.name === "lote_id") {
      handleGetCDPS(e.target.value);
    }

    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const searchInfo = async () => {
    if (Object.values(search).some((value) => value === "")) {
      toast.error('Todos los datos son obligatorios');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCDPInfo(search.cdp_id);
      setData(data);
    } catch (error) {
      toast.warning(
        "Hubo un error al buscar los datos o no exite información relacionada"
      );
    } finally {
      setLoading(false);
    }
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
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
              onChange={(e) => handleChange(e)}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {fincas.map((finca) => (
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
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
              onChange={(e) => handleChange(e)}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {lotes.map((lote) => (
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
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
              onChange={(e) => handleChange(e)}
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              {cdps.map((cdp) => (
                <option key={cdp.id} value={cdp.id}>
                  {cdp.cdp}
                </option>
              ))}
            </select>
          </div>

        </div>
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => searchInfo()}
        >
          {loading ? <Spinner /> : <Search />}
        </button>
      </div>


      {(!loading && data.data && data.data_lote) && (
        <div className="space-y-5">
          <div className="mt-10 shadow-xl p-5">
            <h2 className="text-center text-xl font-bold uppercase">
              Información del Lote
            </h2>
            <TaskLabel label="Control de Plantación" text={data.data_lote.cdp} />
            <TaskLabel label="Fecha de Incio" text={formatDate(data.data_lote.start_date_cdp)} />
            <TaskLabel label="Fecha Final" text={data.data_lote.end_date_cdp ? formatDate(data.data_lote.start_date_cdp) : 'SIN CIERRE'} />
          </div>

          <div className="space-y-5">
            {Object.entries(data.data).map(([week, tasks]) => (
              <div key={week} className="p-5">
                <h1
                  className="font-bold text-center uppercase text-xl mb-5"
                >
                  Semana {week} <span className="text-xs">(Calendario)</span>
                </h1>
                <table className="table">
                  <thead>
                    <tr className="thead-tr">
                      <th scope="col" className="thead-th">
                        TAREA
                      </th>
                      <th scope="col" className="thead-th">
                        ESTADO
                      </th>
                      <th scope="col" className="thead-th">
                        Semana de Aplicación
                      </th>
                      <th scope="col" className="thead-th">
                        HORAS TEORICAS
                      </th>
                      <th scope="col" className="thead-th">
                        HORAS REALES
                      </th>
                      <th scope="col" className="thead-th">
                        RENDIMIENTO
                      </th>
                      <th scope="col" className="thead-th">
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-bold">
                    {tasks.map((task) => (
                      <tr className="tbody-tr" key={task.id}>
                        <td className="tbody-td">{task.task}</td>
                        <td className="tbody-td uppercase  text-center font-bold text-white">{task.closed ? <p className="bg-green-500">CERRADA</p> : <p className="bg-red-500">SIN CIERRE</p>}</td>
                        <td className="tbody-td">{(task.aplication_week)}</td>
                        <td className="tbody-td">{task.hours}</td>
                        <td className="tbody-td">{task.real_hours ?? 0}</td>
                        <td className="tbody-td">{task.performance ?? 0} %</td>
                        <td className="tbody-td">
                          {task.closed ? (
                            <EyeIcon className="cursor-pointer hover:text-gray-500" onClick={() => {
                              window.open(
                                `/planes-semanales/tareas-lote/informacion/${task.id}`,
                              );
                            }} />
                          ) : <></>}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
