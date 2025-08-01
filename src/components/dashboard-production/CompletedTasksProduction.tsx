import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type TaskProductionDashboardInProgress = {
  id: number;
  line: string;
  product: string;
  sku: string;
  fecha: string;
  "tiempo total": string;
};

const columnHelper = createColumnHelper<TaskProductionDashboardInProgress>();

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
  columnHelper.accessor("fecha", {
    header: () => "FECHA",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tiempo total", {
    header: () => "TIEMPO TOTAL USADO",
    cell: (info) => info.getValue(),
  }),
];

const mockTasks: TaskProductionDashboardInProgress[] = [
  {
    id: 1,
    line: "Línea 1",
    product: "Piña Oro",
    sku: "SKU-001",
    fecha: "2025-07-29",
    "tiempo total": "180 min",
  },
  {
    id: 2,
    line: "Línea 2",
    product: "Banano Premium",
    sku: "SKU-002",
    fecha: "2025-07-30",
    "tiempo total": "240 min",
  },
  {
    id: 3,
    line: "Línea 3",
    product: "Mango Kent",
    sku: "SKU-003",
    fecha: "2025-07-31",
    "tiempo total": "200 min",
  },
];

export default function CompletedTasksProduction() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: mockTasks,
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
        CONTROL DE TAREAS TERMINADAS
      </p>

      <div className="w-full">
        <div className="bg-white rounded-b-lg shadow-sm p-5">
          <table className="table">
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
                <tr key={row.id} className="tbody-tr">
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
