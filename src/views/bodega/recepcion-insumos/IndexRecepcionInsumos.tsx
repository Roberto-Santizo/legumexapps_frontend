import { Eye, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { getInsumosReceipts, InsumosReceipt } from "@/api/RecepcionInsumosAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FiltersReceptionsInsumos from "@/components/filters/FiltersInsumosBodega";

export type FiltersReceptionsInsumos = {
  invoice: string;
  received_by: string;
  received_date: string;
  invoice_date: string;
};

const initialValues: FiltersReceptionsInsumos = {
  invoice: "",
  received_by: "",
  received_date: "",
  invoice_date: "",
};

export default function IndexInsumos() {
  const [receipts, setReceipts] = useState<InsumosReceipt[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [modal, setModal] = useState<boolean>(false);
  const [filters, setFilters] =
    useState<FiltersReceptionsInsumos>(initialValues);
  const [tempFilters, setTempFilters] =
    useState<FiltersReceptionsInsumos>(initialValues);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getInsumosReceipts", currentPage, filters],
    queryFn: () => getInsumosReceipts(currentPage, filters),
  });

  useEffect(() => {
    if (data) {
      setReceipts(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  if (receipts)
    return (
      <>
        <h1 className="font-bold text-4xl capitalize">Recepción de insumos</h1>
        <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
          <Link
            to="/recepciones-insumos/crear"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-6 md:w-8" />
            <p className="text-sm md:text-base">Crear</p>
          </Link>
          <Bars3Icon
            className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
            onClick={() => setModal(true)}
          />
        </div>

        <table className="table mt-10">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Factura</th>
              <th className="thead-th">Recibido Por</th>
              <th className="thead-th">Proveedor</th>
              <th className="thead-th">Fecha de Recepción</th>
              <th className="thead-th">Fecha de Factura</th>
              <th className="thead-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr className="tbody-tr" key={receipt.id}>
                <td className="tbody-td">{receipt.invoice}</td>
                <td className="tbody-td">{receipt.received_by}</td>
                <td className="tbody-td">{receipt.supplier}</td>
                <td className="tbody-td">{receipt.received_date}</td>
                <td className="tbody-td">{receipt.invoice_date}</td>
                <td className="tbody-td">
                  <Link
                    to={`/recepciones-insumos/${receipt.id}`}
                    target="__blank"
                  >
                    <Eye className="hover:text-gray-500 cursor-pointer" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 mb-10 flex justify-center md:justify-end">
          {
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          }
        </div>

        {modal && (
          <FiltersReceptionsInsumos
            setIsOpen={setModal}
            isOpen={modal}
            filters={filters}
            setFilters={setFilters}
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
          />
        )}
      </>
    );
}
