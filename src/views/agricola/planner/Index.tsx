import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Table from "@/components/shared/Table";
import Pagination from "@/components/shared/Pagination";
import getDraftWeeklyPlans from "@/api/PlannerFincasAPI";
import TableLoader from "@/components/shared/TableLoader";

export default function Index() {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(0);

  const { data, isLoading } = useQuery({
    queryKey: ['getDraftWeeklyPlans', page, rowsPerPage],
    queryFn: () => getDraftWeeklyPlans({ page, limit: rowsPerPage })
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleOnRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  useEffect(() => {
    setCount(data?.meta.total ?? 100);
  }, [data]);


  if (isLoading) return <TableLoader columns={3} />;
  if (data) return (
    <div>
      <h2 className="font-bold text-center xl:text-left text-4xl">Planificador de Fincas - Plan de siembras</h2>

      <Table navigateCol={'id'} navigateUrl="/planificador-fincas" columns={['finca', 'week', 'year']} data={data.data} />

      <Pagination count={count} page={page} rowsPerPage={rowsPerPage} handleOnPageChange={handleChangePage} handleOnRowsPerPageChange={handleOnRowsPerPageChange} />
    </div>
  )
}
