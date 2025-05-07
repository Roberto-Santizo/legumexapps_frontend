import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPaginatedPackingMaterials, PackingMaterial, updateMaterialStatus } from "@/api/MaterialEmpaqueAPI";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import FiltersMaterialEmpaque from "@/components/filters/FiltersMaterialEmpaque";
import { Bars3Icon } from "@heroicons/react/16/solid";

export type FiltersPackingMaterials = {
  name: string;
  code: string;
  status: string;
}

const initialValues = {
  name: '',
  code: '',
  status: ''
};

export default function IndexMaterialEmpaque() {

  const [items, setItems] = useState<PackingMaterial[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FiltersPackingMaterials>(initialValues);
  const [tempFilters, setTempFitlers] = useState<FiltersPackingMaterials>(initialValues);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['getPaginatedPackingMaterials', currentPage, filters],
    queryFn: () => getPaginatedPackingMaterials({ currentPage, filters })
  });

  const { mutate } = useMutation({
    mutationFn: updateMaterialStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      refetch();
    }
  });

  const handleChangeStatus = (id: PackingMaterial['id']) => mutate(id);

  useEffect(() => {
    if (data) {
      setItems(data.data);
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (data) return (
    <>
      <h1 className="font-bold text-4xl">Material de empaque</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
        <Link
          to="/material-empaque/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-6 md:w-8" />
          <p className="text-sm md:text-base">Crear</p>
        </Link>


        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />
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
          {items.map(item => (
            <tr className="tbody-tr" key={item.id}>
              <td className="tbody-td">{item.name}</td>
              <td className="tbody-td">{item.description}</td>
              <td className="tbody-td">{item.code}</td>
              <td className='tbody-td' onClick={() => handleChangeStatus(item.id)}>
                <span className={`${item.blocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} button`}>{item.blocked ? 'ACTIVO' : 'DESACTIVADO'}</span>
              </td>
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

      {isOpen && (
        <FiltersMaterialEmpaque isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} setTempFilters={setTempFitlers} tempFilters={tempFilters} filters={filters}/>
      )}
    </>
  )
}
