import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Inputs } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import {getPaginatedInsumos} from "@/api/BodegaInsumosAPI";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";


export default function IndexInsumos() {
  const [insumos, setInsumos] = useState<Inputs[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedInsumos", currentPage],
    queryFn: () => getPaginatedInsumos(currentPage),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setInsumos(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <h1 className="font-bold text-3xl uppercase">Recepción de insumos</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/form/insumos/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Registrar insumos</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Unidades</th>
            <th className="thead-th">Valor unitario</th>
            <th className="thead-th">Valor total</th>
            <th className="thead-th">Factura</th>
            <th className="thead-th">Fecha de factura</th>
            <th className="thead-th">Fecha de recepción</th>

          </tr>
        </thead>
        <tbody>
          {insumos.map(insumo => (
            <tr className="tbody-tr">
              <td className="tbody-td">{insumo.units}</td>
              <td className="tbody-td">{insumo.unit_value}</td>
              <td className="tbody-td">{insumo.total_value}</td>
              <td className="tbody-td">{insumo.invoice}</td>
              <td className="tbody-td">{insumo.invoice_date}</td>
              <td className="tbody-td">{insumo.receipt_date}</td>
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
    </>
  )
}
