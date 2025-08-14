import { getSummaryDraftLines } from "@/api/DraftWeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { FileSymlink } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, YAxis, LabelList } from "recharts";
import { FiltersDraftsTasks } from "./Show";
import { CategoricalChartState } from "recharts/types/chart/types";
import * as XLSX from 'xlsx';

type Props = {
    setFilters: Dispatch<SetStateAction<FiltersDraftsTasks>>;
    filters: FiltersDraftsTasks;
}

export default function SummaryLines({ setFilters, filters }: Props) {
    const params = useParams<{ id: string }>();
    const id = params.id!;
    const [lineView, setLineView] = useState<string>('A');

    const { data: lines } = useQuery({
        queryKey: ['getSummaryDraftLines', id, filters.line],
        queryFn: () => getSummaryDraftLines({ id, line: filters.line }),
        refetchOnWindowFocus: false
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

    const handleClickLineBar = (e: CategoricalChartState) => {
        if (e.activePayload && e.activePayload.length > 0) {
            if (filters.line === e.activePayload[0].payload.line_id) {
                setFilters((prev) => ({
                    ...prev,
                    line: ''
                }));
            } else {
                setFilters((prev) => ({
                    ...prev,
                    line: `${e.activePayload?.[0]?.payload?.line_id ?? ''}`
                }));
            }
        }
    }

    const handleClickRow = (id: string) => {
        if (filters.line === id) {
            setFilters((prev) => ({
                ...prev,
                line: ''
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                line: id
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
                        <BarChart onClick={(e) => handleClickLineBar(e)} data={lines} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <YAxis />
                            <Tooltip key={'line'} />
                            <Legend />
                            <Bar dataKey="total_hours" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} >
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
                                <tr className="thead-tr">
                                    <th className="thead-th">Linea</th>
                                    <th className="thead-th">Total de horas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines?.map((line) => (
                                    <tr key={line.line_id} className="tbody-tr" onClick={() => handleClickRow(line.line_id)}>
                                        <td className="tbody-td">{line.line}</td>
                                        <td className="tbody-td">{line.total_hours}</td>
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
