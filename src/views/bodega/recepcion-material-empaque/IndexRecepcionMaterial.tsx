import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPaginatedReceptionsPackingMaterial, ReceptionPackigMaterial } from "@/api/ReceptionPackingMaterialsAPI";
import { useQuery } from "@tanstack/react-query";
import { Bars3Icon } from "@heroicons/react/16/solid";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FiltersReceptionsPackingMaterial from "@/components/filters/FiltersReceptionsPackingMaterial";
import HoverCardReceptionPM from "@/components/ui/HoverCardReceptionPMt";


export type FiltersReceptionsPackingMaterial = {
  supervisor_name: string;
  received_by: string;
  contains: string;
  receipt_date: string;
  invoice_date: string;
}

const initialValues: FiltersReceptionsPackingMaterial = {
  supervisor_name: '',
  received_by: '',
  contains: '',
  receipt_date: '',
  invoice_date: '',
}

export default function IndexRecepcionMaterial() {
  const [documents, setDocuments] = useState<ReceptionPackigMaterial[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersReceptionsPackingMaterial>(initialValues);
  const [tempFilters, setTempFilters] = useState<FiltersReceptionsPackingMaterial>(initialValues);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedProveedor", currentPage, filters],
    queryFn: () => getPaginatedReceptionsPackingMaterial(currentPage, filters),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setDocuments(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <h1 className="font-bold text-3xl">
        Recepciones Material de Empaque
      </h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/recepciones-mp/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">
            Crear
          </p>
        </Link>


        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setModal(true)}
        />
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Fecha de Recepción</th>
            <th className="thead-th">Fecha de Factura</th>
            <th className="thead-th">Recibo Por</th>
            <th className="thead-th">Supervisado Por</th>
            <th className="thead-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <HoverCardReceptionPM key={document.id} document={document} />
          ))}
        </tbody>
      </table>

      <div className="mt-5 mb-10 flex justify-center md:justify-end">
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
        />
      </div>

      {modal && (
        <FiltersReceptionsPackingMaterial setIsOpen={setModal} isOpen={modal} filters={filters} setFilters={setFilters} tempFilters={tempFilters} setTempFilters={setTempFilters} />
      )}
    </>
  );
}
