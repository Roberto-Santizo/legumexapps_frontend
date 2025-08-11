import { PlusIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLineas } from "@/api/LinesAPI";
import { Line } from "types/linesTypes";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function Index() {
  const [lineas, setLineas] = useState<Line[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getLineasPaginated', currentPage],
    queryFn: () => getLineas({ page: currentPage, paginated: 'true' }),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data) {
      setLineas(data.data);
    }
    if (data?.meta) {
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
      <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Lineas</h2>
      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex xl:flex-row flex-col justify-end gap-5 w-full">
          <Link
            to="/lineas/crear"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>crear lineas</p>
          </Link>
        </div>
      </div>

      <div className="mt-10 table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">CODIGO</th>
              <th scope="col" className="thead-th">LINEA</th>
              <th scope="col" className="thead-th">TURNO</th>
              <th scope="col" className="thead-th">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {lineas.map(linea => (
              <tr key={linea.id} className="tbody-tr">
                <td className="tbody-td">{linea.code}</td>
                <td className="tbody-td">{linea.name}</td>
                <td className="tbody-td">{linea.shift}</td>
                <td className="tbody-td flex gap-5">
                  <Link to={`/lineas/posiciones/${linea.id}`}>
                    <Users className="hover:text-gray-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-10 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>

    </>
  )
}
