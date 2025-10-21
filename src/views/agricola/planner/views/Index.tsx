import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { usePlannerFincasFilters } from "../hooks/usePlannerFincasFilters";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { getDraftWeeklyPlans } from "../api/PlannerAPI";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import TableLoader from "@/components/shared/TableLoader";
import ModalUpload from "../components/ModalUpload";
import IndexFilters from "../components/IndexFilters";

export default function Index() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(0);
  const [_, setSearchParams] = useSearchParams();
  const { filters, setFilters, resetFilters } = usePlannerFincasFilters();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ['getDraftWeeklyPlans', page, rowsPerPage, filters],
    queryFn: () => getDraftWeeklyPlans({ page: page + 1, limit: rowsPerPage, filters: filters})
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleOnRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  useEffect(() => {
    setCount(data?.meta?.total ?? 100);
  }, [data]);

  const handleOpenModal = () => {
    setSearchParams((searchParams) => {
      searchParams.set('upload', "true");
      return searchParams;
    });
  }

  if (isLoading) return <TableLoader columns={3} />;
  if (data) return (
    <div>
      <h2 className="font-bold text-center xl:text-left text-4xl">Planificador de Fincas - Plan de siembras</h2>

      <section className="flex justify-between items-center">
        <button className="button bg-indigo-500 hover:bg-indigo-600 mt-5 flex justify-center items-center gap-2" onClick={() => handleOpenModal()}>
          <PlusIcon />
          <p>Cargar Plan de Siembras</p>
        </button>
        <Bars3Icon
          className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
          onClick={() => setIsOpen(true)}
        />
      </section>

      <Table navigateCol={'id'} navigateUrl="/planificador-fincas" columns={['finca', 'week', 'year']} data={data.data} />

      <Pagination count={count} page={page} rowsPerPage={rowsPerPage} handleOnPageChange={handleChangePage} handleOnRowsPerPageChange={handleOnRowsPerPageChange} />

      <ModalUpload />

      <IndexFilters resetFilters={resetFilters} currentFilters={filters} onApply={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}
