import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getVariedades, Variety } from "@/api/VarietiesAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";


export default function Index() {
  const [variedades, setVariedades] = useState<Variety[]>([]);

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['getPaginatedVarieties', currentPage],
    queryFn: () => getVariedades({ page: currentPage, paginated: 'true' }),
  });

  useEffect(() => {
    if (data) {
      setVariedades(data.data);
    }

    if (data && data.meta) {
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }

    console.log(data);
  }, [data]);


  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(()=>{
    console.log(currentPage);
  }, [currentPage]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <>
      <h2 className="font-bold text-3xl">Variedades</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/productos/variedades/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Variedad</p>
        </Link>
      </div>

      <div className="p-2 mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">ID</th>
              <th scope="col" className="thead-th">Variedad</th>
            </tr>
          </thead>
          <tbody>
            {variedades.map(variedad => (
              <tr key={variedad.id} className="tbody-tr">
                <td className="tbody-td">{variedad.id}</td>
                <td className="tbody-td">{variedad.name}</td>
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
