import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { TaskProductionEmployee } from "types/taskProductionPlanTypes";

type Props = {
    employees: TaskProductionEmployee[];
    onClick: (prop: TaskProductionEmployee) => void;
}

const columnHelper = createColumnHelper<TaskProductionEmployee>();

const columns = [
    columnHelper.accessor('code', {
        header: () => 'CÓDIGO',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('name', {
        header: () => 'NOMBRE',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('position', {
        header: () => 'POSICIÓN',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('flag', {
        header: () => 'ESTADO',
        cell: (info) => info.getValue() ? <CheckCircleIcon className="text-green-500" /> : <XCircleIcon className="text-red-500" />
    }),
];

export default function TableEmployees({ employees, onClick }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filterText, setFilterText] = useState<string>('');

    const table = useReactTable({
        data: employees ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            globalFilter: filterText
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFilterText,
        getFilteredRowModel: getFilteredRowModel()
    });

    return (
        <div className="w-full max-h-96 overflow-y-scroll scrollbar-hide">
            <div className="flex flex-col gap-1 w-full max-w-sm sticky top-0">
                <label className="text-sm font-semibold text-gray-700">Buscador</label>
                <input
                    value={filterText ?? ''}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Ingrese valor..."
                    className="p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition text-base shadow-sm"
                />
            </div>

            <div className="bg-white rounded-b-lg shadow-sm mt-5">
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
                            <tr key={row.id} className="tbody-tr">
                                {row.getVisibleCells().map(cel => (
                                    <td key={cel.id} className="tbody-td" onClick={() => onClick(cel.row.original)}>
                                        {flexRender(cel.column.columnDef.cell, cel.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
