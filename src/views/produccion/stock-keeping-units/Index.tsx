import { EyeIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSkus } from "@/api/SkusAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { StockKeepingUnit } from "@/types/stockKeepingUnitTypes";
import Pagination from "@/components/utilities-components/Pagination";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalCargaSku from "@/components/modals/ModalCargaSku";
import ModalCargaRecipeSku from "@/components/modals/ModalCargaRecipeSku";
import ModalCargaRecipeRawMaterialSku from "@/components/modals/ModalCargaRecipeRawMaterialSku";
import FiltersSku from "@/components/filters/FiltersSku";


export type FiltersSku = {
  product_name: string;
  code: string;
}

export const FiltersSkuInitialValues: FiltersSku = {
  product_name: '',
  code: ''
};

export default function Index() {
  const [skus, setSkus] = useState<StockKeepingUnit[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersSku>(FiltersSkuInitialValues);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { hasPermission } = usePermissions();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSkusPaginated', currentPage, filters],
    queryFn: () => getSkus({ page: currentPage, paginated: 'true', filters }),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    if (data) {
      setSkus(data.data);
    }

    if (data && data.meta) {
      setPageCount(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    }
  }, [data]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    const filters = {
      'product_name': searchParams.get('product_name') ?? '',
      'code': searchParams.get('code') ?? '',
    }

    setFilters(filters);
  }, [searchParams]);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <>
      <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Stock Keeping Units</h2>

      <div className="flex xl:flex-row flex-col justify-end gap-5 flex-wrap mt-5">
        {hasPermission('create sku') && (
          <>
            <Link
              to="/skus/crear"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <p>Crear SKU</p>
            </Link>

            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
              onClick={() => navigate(`${location.pathname}?uploadSkus=true`)}
            >
              <PlusIcon className="w-5 h-5" />
              <p>Carga Masiva de SKU</p>
            </button>
          </>
        )}

        {hasPermission('create packing material recipe') && (
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
            onClick={() => navigate(`${location.pathname}?uploadPackingMaterialRecipe=true`)}
          >
            <PlusIcon className="w-5 h-5" />
            <p>Carga Masiva de Recetas Material de Empaque</p>
          </button>
        )}


        {hasPermission('create raw material recipe') && (
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
            onClick={() => navigate(`${location.pathname}?uploadRawMaterialRecipe=true`)}
          >
            <PlusIcon className="w-5 h-5" />
            <p>Carga Masiva de Recetas Materia Prima</p>
          </button>
        )}

        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />

      </div>


      <div className="mt-10 table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">Codigo</th>
              <th scope="col" className="thead-th">Producto</th>
              <th scope="col" className="thead-th">Presentación</th>
              <th scope="col" className="thead-th">Cliente</th>
              <th scope="col" className="thead-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {skus.map(sku => (
              <tr key={sku.id} className="tbody-tr">
                <td className="tbody-td">{sku.code}</td>
                <td className="tbody-td">{sku.product_name}</td>
                <td className="tbody-td">{sku.presentation}</td>
                <td className="tbody-td">{sku.client_name}</td>
                <td className="tbody-td">
                  <Link to={`/skus/${sku.id}`}>
                    <EyeIcon className="w-12 hover:text-gray-500" />
                  </Link>
                </td>
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

      <ModalCargaSku currentPage={currentPage} />
      <ModalCargaRecipeSku currentPage={currentPage} />
      <ModalCargaRecipeRawMaterialSku currentPage={currentPage} />


      {isOpen && (
        <FiltersSku isOpen={isOpen} setIsOpen={setIsOpen} filters={filters} setFilters={setFilters} setSearchParams={setSearchParams} searchParams={searchParams} />
      )}

    </>
  )
}
