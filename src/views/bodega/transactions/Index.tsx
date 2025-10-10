import { EyeIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPackingMaterialTransactions } from "@/api/PackingMaterialTransactionsAPI";
import { PackingMaterialTransaction } from "@/types/packingMaterialTransactionTypes";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FiltersPackingMaterialTransactions from "@/components/filters/FiltersPackingMaterialTransactions";

export type FiltersPackingMaterialsTransactionType = {
  transaction_id: string;
  responsable: string;
  delivered_by: string;
  delivered_date: string;
  type: string;
  sku: string;
}

export const FiltersPackingMaterialsTransactionInitialValues: FiltersPackingMaterialsTransactionType = {
  transaction_id: '',
  responsable: '',
  delivered_by: '',
  delivered_date: '',
  type: '',
  sku: ''
};

export default function Index() {

  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactions, setTransactions] = useState<PackingMaterialTransaction[]>([]);
  const [filters, setFilters] = useState<FiltersPackingMaterialsTransactionType>(FiltersPackingMaterialsTransactionInitialValues);

  const [modal, setModal] = useState<boolean>(false);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getPackingMaterialDispatches', currentPage, filters],
    queryFn: () => getPackingMaterialTransactions({ page: currentPage, paginated: 'true', filters }),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data) {
      setTransactions(data.data)
    }

    if (data?.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isError) return <ShowErrorAPI />
  if (isLoading) return <Spinner />
  if (data) return (
    <>
      <h1 className="font-bold text-xl text-center xl:text-left xl:text-4xl capitalize">
        Transacciones de Material de Empaque
      </h1>

      <div className="flex xl:flex-row flex-col justify-end gap-5 mt-5">
        <Link
          to="/material-empaque-transacciones/crear"
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear</p>
        </Link>
        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setModal(true)}
        />
      </div>

      <div className="table-wrapper">
        <table className="table mt-10">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Referencia</th>
              <th className="thead-th">Responsable</th>
              <th className="thead-th">Entregado Por</th>
              <th className="thead-th">Fecha de Entrega</th>
              <th className="thead-th">Tipo</th>
              <th className="thead-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr className="tbody-tr" key={transaction.id}>
                <td className="tbody-td">{transaction.reference}</td>
                <td className="tbody-td">{transaction.responsable}</td>
                <td className="tbody-td">{transaction.user}</td>
                <td className="tbody-td">{transaction.transaction_date}</td>
                <td className="tbody-td">{transaction.type}</td>
                <td className="tbody-td">
                  <Link target="_blank" to={`/material-empaque-transacciones/${transaction.id}`}>
                    <EyeIcon />
                  </Link>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <div className="mt-5 mb-10 flex justify-center md:justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>

      {modal && (
        <FiltersPackingMaterialTransactions isOpen={modal} setIsOpen={setModal} filters={filters} setFilters={setFilters} />
      )}
    </>
  );
}
