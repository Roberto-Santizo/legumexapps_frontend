import { PencilIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function IndexLotes() {
  // const authUser = useAppStore((state) => state.AuthUser);
  const fetchLotes = useAppStore((state) => state.fetchLotes);
  const loading = useAppStore((state) => state.loadingFetchLotes);
  const errorFetchLoading = useAppStore((state) => state.errorFetchLotes);
  const lotes = useAppStore((state) => state.lotes);

  useEffect(() => {
    fetchLotes();
  }, []);

  return (
    <>
      <h2 className="font-bold text-4xl">Lotes</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/lotes/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Lote</p>
        </Link>
      </div>

      {loading && <Spinner />}
      {!loading && errorFetchLoading && <ShowErrorAPI />}
      {!loading && !errorFetchLoading && (
        <table className="table mt-10">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                ID
              </th>
              <th scope="col" className="thead-th">
                Nombre
              </th>
              <th scope="col" className="thead-th">
                Finca
              </th>
              <th scope="col" className="thead-th">
                CDP Activo
              </th>
              <th scope="col" className="thead-th">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr className="tbody-tr" key={lote.id}>
                <td className="tbody-td">
                    {lote.id}
                </td>
                <td className="tbody-td">
                    {lote.name}
                </td>
                <td className="tbody-td">
                    {lote.finca}
                </td>
                <td className="tbody-td">
                    {lote.cdp}
                </td>
                <td className="tbody-td">
                  <Link to={`/`}>
                    <PencilIcon className="w-8 cursor-pointer hover:text-gray-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
