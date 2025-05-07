import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "@/components/utilities-components/Pagination";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import { getPaginatedMaterial } from "@/api/BodegaMaterialAPI";
import { MaterialReception } from "@/types";

export default function IndexRecepcionMaterial() {
  const [materiales, setMateriales] = useState<MaterialReception[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedProveedor", currentPage],
    queryFn: () => getPaginatedMaterial(currentPage),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setMateriales(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <h1 className="font-bold text-3xl uppercase">
        Recepcion de material de empaque
      </h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/form/material-empaque/ingreso"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">
            Registrar recepcion de material
          </p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Lote</th>
            <th className="thead-th">Cantidad</th>
            <th className="thead-th">Fecha de recepcion</th>
            <th className="thead-th">Fecha de factura</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr className="tbody-tr">
              <td className="tbody-td">{material.lote}</td>
              <td className="tbody-td">{material.quantity}</td>
              <td className="tbody-td">{material.receipt_date}</td>
              <td className="tbody-td">{material.invoice_date}</td>
            </tr>
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
    </>
  );
}
