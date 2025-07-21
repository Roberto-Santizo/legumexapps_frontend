import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPackingMaterials, PackingMaterial, updateMaterialStatus } from "@/api/MaterialEmpaqueAPI";
import { toast } from "react-toastify";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import "@/lib/echo"; 
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import FiltersMaterialEmpaque from "@/components/filters/FiltersMaterialEmpaque";
import ModalCargaItemsMP from "@/components/modals/ModalCargaItemsMP";

export type FiltersPackingMaterialsType = {
  name: string;
  code: string;
  status: string;
  supplier: string;
}

export type ChangeItemStatusEvent = {
  status: string;
}


export const FiltersPackingMaterialsInitialValues: FiltersPackingMaterialsType = {
  name: '',
  code: '',
  status: '',
  supplier: ''
};

export default function IndexMaterialEmpaque() {
  const { data: user } = useAuth();
  const [items, setItems] = useState<PackingMaterial[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FiltersPackingMaterialsType>(FiltersPackingMaterialsInitialValues);
  const [tempFilters, setTempFitlers] = useState<FiltersPackingMaterialsType>(FiltersPackingMaterialsInitialValues);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && window.Echo) {
      window.Echo.private(`item.status`).listen('.ChangeItemStatus', (e: ChangeItemStatusEvent) => {
        toast.success(e.status);
        queryClient.invalidateQueries({queryKey: ['getPaginatedPackingMaterials', currentPage, filters],});
      });
    }
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['getPaginatedPackingMaterials', currentPage, filters],
    queryFn: () => getPackingMaterials({ currentPage, filters, paginated: 'true' }),
    placeholderData: keepPreviousData
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
    }
    if (data?.meta) {
      setCurrentPage(data.meta.current_page);
      setPageCount(data.meta.last_page);
    }
  }, [data]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (data) return (
    <>
      <h1 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Items Material Empaque</h1>
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">

        {hasPermission('create item packing material') && (
          <div className="flex xl:flex-row flex-col gap-3">
            <Link
              to="/material-empaque/crear"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
            >
              <PlusIcon className="w-6 md:w-8" />
              <p className="text-sm md:text-base">Crear</p>
            </Link>

            <button className="button bg-indigo-500 hover:bg-indigo-600 flex items-center gap-2" onClick={() => setModal(true)}>
              <PlusIcon />
              <p>Carga Masiva de Items</p>
            </button>
          </div>
        )}


        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />

      </div>

      <div className="table-wrapper">
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
                <td className='tbody-td'>
                  <button
                    onClick={hasPermission('create item packing material') ? () => handleChangeStatus(item.id) : undefined}
                    className={`${item.blocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} button`}>
                    {item.blocked ? 'DESACTIVADO' : 'ACTIVADO'}
                  </button>
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

      {isOpen && (
        <FiltersMaterialEmpaque isOpen={isOpen} setIsOpen={setIsOpen} setFilters={setFilters} setTempFilters={setTempFitlers} tempFilters={tempFilters} filters={filters} />
      )}

      <ModalCargaItemsMP modal={modal} setModal={setModal} currentPage={currentPage} />
    </>
  )
}
