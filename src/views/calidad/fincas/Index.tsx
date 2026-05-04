import { getFincas } from "@/api/FincasAPI"
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query"
import Spinner from "@/components/utilities-components/Spinner";

export default function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["getAllFincas"], queryFn: getFincas,
  });

  if (isLoading) return <Spinner />;
  if (data) return (
    <div>
      <h2 className="font-bold md:text-4xl text-xl text-center md:text-left">Fincas</h2>

      <div className="flex md:flex-row flex-col justify-end md:gap-5">
        <Link
          to="/fincas/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Finca</p>
        </Link>
      </div>


      {data ? (
        <table className="table mt-5">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th uppercase">Finca</th>
              <th scope="col" className="thead-th uppercase">Código Finca</th>
            </tr>
          </thead>
          <tbody>
            {data.map(cdp => (
              <tr key={cdp.id} className="tbody-tr">
                <td className="tbody-td">{cdp.name}</td>
                <td className="tbody-td">{cdp.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <Spinner />}
    </div>
  )
}
