import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import { MaterialRegister } from "@/types";
import { getPaginatedRegistroMaterial } from "@/api/BodegaRegistroMaterialAPI";

export default function IndexMaterialEmpaque() {
  const [registrosMaterial, setregistrosMaterial] = useState<MaterialRegister[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPaginatedRegistroMaterial", currentPage],
    queryFn: () => getPaginatedRegistroMaterial(currentPage),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    if (data) {
      setregistrosMaterial(data.data);
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;

  return (
    <>
      <h1 className="font-bold text-3xl uppercase">Material de empaque</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/material-empaque/registro"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Registrar material de empaque</p>
        </Link>
      </div>

      <table className="table mt-10">
        <thead>
          <tr className="thead-tr">
            <th className="thead-th">Nombre</th>
            <th className="thead-th">Descripcion</th>
            <th className="thead-th">código</th>
            <th className="thead-th">Bloqueo</th>
          </tr>
        </thead>
        <tbody>
          {registrosMaterial.map(registroMaterial => ( 
          <tr className="tbody-tr">
            <td className="tbody-td">{registroMaterial.name}</td>
            <td className="tbody-td">{registroMaterial.description}</td>
            <td className="tbody-td">{registroMaterial.code}</td>
            <td className="tbody-td">{registroMaterial.blocked}</td>
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
