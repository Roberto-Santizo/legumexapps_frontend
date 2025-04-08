import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSkusPaginated, SKU } from "@/api/SkusAPI";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";


export default function IndexSKU() {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSkusPaginated', currentPage],
    queryFn: () => getSkusPaginated(currentPage)
  });

  useEffect(() => {
    if (data) {
      setSkus(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <>
      <h2 className="font-bold text-4xl">SKU</h2>

      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <Link
            to="/skus/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Crear sku</p>
          </Link>
        </div>
      </div>


      <div className="mt-10">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">Codigo</th>
              <th scope="col" className="thead-th">Producto</th>
              <th scope="col" className="thead-th">Presentación</th>
              <th scope="col" className="thead-th">Cliente</th>
            </tr>
          </thead>
          <tbody>
            {skus.map(sku => (
              <tr key={sku.id} className="tbody-tr">
                <td className="tbody-td">{sku.code}</td>
                <td className="tbody-td">{sku.product_name}</td>
                <td className="tbody-td">{sku.presentation}</td>
                <td className="tbody-td">{sku.client_name}</td>
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
