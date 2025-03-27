import { PlusIcon, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import { getLineasPaginated, Linea } from "@/api/LineasAPI";

export default function IndexLineas() {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getLineasPaginated', currentPage],
    queryFn: () => getLineasPaginated(currentPage)
  });

  useEffect(() => {
    if (data) {
      setLineas(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  return (
    <>
      <h2 className="font-bold text-4xl">Lineas</h2>
      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/lineas/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>crear lineas</p>
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">codigo</th>
              <th scope="col" className="thead-th">linea</th>
              <th scope="col" className="thead-th">turno</th>
              <th scope="col" className="thead-th">total de personas</th>
              <th scope="col" className="thead-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lineas.map(linea => (
              <tr key={linea.id} className="tbody-tr">
                <td className="tbody-td">{linea.code}</td>
                <td className="tbody-td">{linea.name}</td>
                <td className="tbody-td">{linea.shift}</td>
                <td className="tbody-td">{linea.total_persons}</td>
                <td className="tbody-td">
                  <Link to={`/lineas/editar/${linea.id}`}>
                    <Edit2 />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mb-10 flex justify-end">
          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}
