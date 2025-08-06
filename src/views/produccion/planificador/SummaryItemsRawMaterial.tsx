import { getSummaryDraftRawMaterial } from "@/api/DraftWeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { saveAs } from "file-saver";
import { ArrowDown, ArrowUp, FileSymlink } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, YAxis, XAxis, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { WeeklyProductionPlanDraftSummaryItem } from "types/draftWeeklyProductionPlanTypes";
import * as XLSX from 'xlsx';
import { FiltersDraftsTasks } from "./ShowPlanification";

type Props = {
    filters: FiltersDraftsTasks;
}

const columnHelper = createColumnHelper<WeeklyProductionPlanDraftSummaryItem>();

const columns = [
    columnHelper.accessor('code', {
        header: () => 'Código',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('name', {
        header: () => 'Nombre',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('quantity', {
        header: () => 'Cantidad',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('inventory', {
        header: () => 'Inventario',
        cell: (info) => info.getValue()
    }),
];


export default function SummaryItemsRawMaterial({filters} : Props) {
    const params = useParams<{ id: string }>();
    const id = params.id!;
    const [mpView, setMpView] = useState<string>('A');
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: items } = useQuery({
        queryKey: ['getSummaryDraftRawMaterial', id, filters.line],
        queryFn: () => getSummaryDraftRawMaterial({ id, line: filters.line}),
        refetchOnWindowFocus: false
    });


    const CustomToolTip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const data: WeeklyProductionPlanDraftSummaryItem = payload[0].payload;

            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 space-y-1 text-sm text-gray-700">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Código</p>
                    <p className="font-semibold text-base text-gray-800">{label}</p>

                    <hr className="my-1 border-gray-100" />

                    <div>
                        <p className="text-xs text-gray-500">Nombre</p>
                        <p className="font-medium">{data.name}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Cantidad</p>
                        <p className="font-medium">{data.quantity}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Inventario</p>
                        <p className="font-medium">{data.inventory}</p>
                    </div>
                </div>
            );
        }

        return null;
    }


    const table = useReactTable({
        data: items ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting
    });

    const handleExportExcel = () => {
        const data = items?.map((item) => ({
            CODIGO: item.code,
            NOMBRE: item.name,
            CANTIDAD: item.quantity,
        }))

        const worksheet = XLSX.utils.json_to_sheet(data ?? []);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const fileData = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(fileData, 'Items.xlsx');
    };

    if (items) return (
        <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Materia Prima</h2>
                <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                    <button
                        onClick={() => setMpView('A')}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${mpView === 'A'
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                    >
                        Vista Gráfica
                    </button>

                    <button
                        onClick={() => setMpView('B')}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${mpView === 'B'
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                    >
                        Vista Tabla
                    </button>

                    <button
                        onClick={handleExportExcel}
                        className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium flex items-center gap-2 shadow-sm transition-all duration-200"
                    >
                        <FileSymlink className="w-4 h-4" />
                        Exportar
                    </button>
                </div>

            </div>

            <div className="h-[400px] bg-gray-50 rounded-md p-2">
                {mpView === 'A' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={items} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="code" />
                            <YAxis />
                            <Tooltip content={<CustomToolTip />} />
                            <Legend />
                            <Bar dataKey="quantity" fill="#3D990B" activeBar={<Rectangle fill="green" stroke="black" />} />
                            <Bar dataKey="inventory" fill="#F26C00" activeBar={<Rectangle fill="orange" stroke="black" />} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="max-h-96 scrollbar-hide overflow-x-auto">
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
                                            <td key={cel.id} className="tbody-td">
                                                {flexRender(cel.column.columnDef.cell, cel.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}
