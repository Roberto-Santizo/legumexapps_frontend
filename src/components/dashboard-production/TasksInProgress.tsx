import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetTasksProductionInProgress } from "@/api/DashboardProductionAPI";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { TaskProductionDashboardInProgress } from "types/dashboardProductionTypes";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper<TaskProductionDashboardInProgress>();

const columns = [
  columnHelper.accessor('line', {
    header: () => 'LINEA',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('product', {
    header: () => 'Producto',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('sku', {
    header: () => 'SKU',
    cell: (info) => info.getValue()
  }),
];

export type filtersDashboardTasksInProgress = {
  line: string;
}

const filtersDashboardTasksInProgressInitialValues: filtersDashboardTasksInProgress = {
  line: ''
}

export default function TasksInProgress() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<filtersDashboardTasksInProgress>(filtersDashboardTasksInProgressInitialValues);
  const navigate = useNavigate();

  const { data: tasks } = useQuery({
    queryKey: ["GetTasksProductionInProgress", filters],
    queryFn: () => GetTasksProductionInProgress({ filters }),
    placeholderData: keepPreviousData
  });

  const table = useReactTable({
    data: tasks ?? [],
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting
  });

  useEffect(() => {
    const order = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : '';
    setFilters({
      line: order
    })
  }, [sorting]);

  if (tasks) return (
    <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        CONTROL DE TAREAS EN PROCESO
      </p>
      <div className="w-full">
        <div className="bg-white rounded-b-lg shadow-sm p-5 ">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="thead-tr">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="thead-th" >
                      <div  {...{ className: header.column.getCanSort() ? 'cursor-pointer select-none flex gap-2' : '', onClick: header.column.getToggleSortingHandler() }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ArrowUp className="w-4" />, desc: <ArrowDown className="w-4" /> }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="tbody-tr" onClick={() => navigate(`/planes-produccion/informacion/${row.original.id}`)}>
                  {row.getVisibleCells().map(cel => (
                    <td key={cel.id} className="tbody-td">
                      {flexRender(cel.column.columnDef.cell, cel.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
