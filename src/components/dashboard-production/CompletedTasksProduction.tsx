import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetFinishedTasksProduction } from "@/api/DashboardProductionAPI";
import { TaskProductionDashboard } from "@/types/dashboardProductionTypes";
import { useNavigate } from "react-router-dom";


const columnHelper = createColumnHelper<TaskProductionDashboard>();

const columns = [
  columnHelper.accessor("line", {
    header: () => "LINEA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("product", {
    header: () => "PRODUCTO",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("sku", {
    header: () => "SKU",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("operation_date", {
    header: () => "FECHA",
    cell: (info) => info.getValue(),
  }),
];

export default function CompletedTasksProduction() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();

  const { data: tasks } = useQuery({
    queryKey: ["GetFinishedTasksProduction"],
    queryFn: GetFinishedTasksProduction,
    placeholderData: keepPreviousData
  });


  const table = useReactTable({
    data: tasks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gradient-to-r from-slate-700 to-slate-600 text-white p-3 font-bold rounded-t-xl text-2xl">
        TAREAS TERMINADAS
      </p>

      <div className="w-full">
        <div className="bg-white rounded-b-lg shadow-sm p-5">
          <table className="table max-h-96 overflow-y-scroll scrollbar-hide">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="thead-tr">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="thead-th">
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex gap-2"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="w-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="w-4" />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="tbody-tr" onClick={() => navigate(`/planes-produccion/tarea-produccion/${row.original.id}`)}>
                  {row.getVisibleCells().map((cel) => (
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
