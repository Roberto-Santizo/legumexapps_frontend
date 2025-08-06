import { getSummaryDraftLines } from "@/api/DraftWeeklyProductionPlanAPI";
import { LineHoursPerWeek } from "@/api/LineasAPI";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { saveAs } from "file-saver";
import { ArrowDown, ArrowUp, FileSymlink } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, YAxis, LabelList } from "recharts";
import { FiltersDraftsTasks } from "./ShowPlanification";
import * as XLSX from 'xlsx';

type Props = {
    setFilters: Dispatch<SetStateAction<FiltersDraftsTasks>>;
    filters: FiltersDraftsTasks;
}

const columnHelper = createColumnHelper<LineHoursPerWeek>();

const columns = [
    columnHelper.accessor('line', {
        header: () => 'Linea',
        cell: (info) => info.getValue()
    }),
    columnHelper.accessor('total_hours', {
        header: () => 'Total de Horas',
        cell: (info) => info.getValue()
    }),
];

export default function SummaryLines({ setFilters, filters }: Props) {
    const params = useParams<{ id: string }>();
    const id = params.id!;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [lineView, setLineView] = useState<string>('A');

    const { data: lines } = useQuery({
        queryKey: ['getSummaryDraftLines', id, filters.line],
        queryFn: () => getSummaryDraftLines({ id, line: filters.line }),
        refetchOnWindowFocus: false
    });

    const table = useReactTable({
        data: lines ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting
    });

    const handleExportExcel = () => {
        const data = lines?.map((line) => ({
            LINEA: line.line,
            HORAS: line.total_hours,
        }))

        const worksheet = XLSX.utils.json_to_sheet(data ?? []);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lineas');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const fileData = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(fileData, 'Lineas.xlsx');
    };

    const handleClickLineBar = (id: number) => {
        if (filters.line === id.toString()) {
            setFilters((prev) => ({
                ...prev,
                line: ''
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                line: id.toString()
            }));
        }
    }

    return (
        <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Gráfica de Líneas</h2>
                <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                    <button
                        onClick={() => setLineView('A')}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${lineView === 'A'
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            }`}
                    >
                        Vista Gráfica
                    </button>

                    <button
                        onClick={() => setLineView('B')}
                        className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${lineView === 'B'
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
                {lineView === 'A' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lines} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar onClick={(e) => handleClickLineBar(e.line_id)} dataKey="total_hours" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} >
                                <LabelList
                                    dataKey="line"
                                    angle={-90}
                                    style={{ fill: 'white', fontSize: 12 }}
                                />
                            </Bar>
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
