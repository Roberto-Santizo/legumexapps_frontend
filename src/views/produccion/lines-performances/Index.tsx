import { getPaginatedLineasSKU } from "@/api/LinesPerformanceAPI";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LinePerformance } from "@/types/linePerformanceTypes";
import { Link, useSearchParams } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/16/solid";
import ModalCargaLineaSku from "@/components/modals/ModalCargaLineaSku";
import ModalEditLineSkuData from "@/components/modals/ModalEditLineSkuData";
import Pagination from "@/components/utilities-components/Pagination";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import FiltersLineSku from "@/components/filters/FiltersLineSku";

export type FiltersLinesPerformance = {
    sku: string;
    line: string;
}
export const FiltersLinesPerformanceInitialValues: FiltersLinesPerformance = {
    sku: '',
    line: ''
};

export default function Index() {
    const [skus, setSkus] = useState<LinePerformance[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [modal, setModal] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FiltersLinesPerformance>(FiltersLinesPerformanceInitialValues);
    const [selectedSku, setSelectedSku] = useState<LinePerformance>({} as LinePerformance);
    const [searchParams, setSearchParams] = useSearchParams();
    const [uploadModal, setUploadModal] = useState<boolean>(false);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedLineasSKU', currentPage, filters],
        queryFn: () => getPaginatedLineasSKU({ page: currentPage, filters }),
        placeholderData: keepPreviousData
    });

    useEffect(() => {
        if (data) {
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setSkus(data.data);
        }
    }, [data])

    useEffect(() => {
        const filters = {
            'sku': searchParams.get('sku') ?? '',
            'line': searchParams.get('line') ?? '',
        }

        setFilters(filters);
    }, [searchParams]);

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (skus) return (
        <div>
            <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Lineas & SKUS</h2>
            <div className="flex flex-col xl:flex-row justify-end gap-3 mt-5 flex-wrap">
                <Link
                    to="/lineas-skus/crear"
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    <p>Relacionar Línea a SKU</p>
                </Link>

                <button
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex items-center gap-2"
                    onClick={() => setUploadModal(true)}
                >
                    <PlusIcon className="w-5 h-5" />
                    <p>Carga Masiva</p>
                </button>

                <Bars3Icon
                    className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
                    onClick={() => setIsOpen(true)}
                />
            </div>

            <div className="table-wrapper">
                <table className="table mt-10">
                    <thead>
                        <tr className="thead-tr">
                            <th className="thead-th">Linea</th>
                            <th className="thead-th">SKU</th>
                            <th className="thead-th">Cliente</th>
                            <th className="thead-th">Producto</th>
                            <th className="thead-th">Turno</th>
                            <th className="thead-th">Libras/Hora</th>
                            <th className="thead-th">Porcentaje Aceptado</th>
                            <th className="thead-th">Método de Pago</th>
                            <th className="thead-th">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skus.map(sku => (
                            <tr key={sku.id} className="tbody-tr" onDoubleClick={() => {
                                setModal(true)
                                setSelectedSku(sku);
                            }}>
                                <td className="tbody-td">{sku.line}</td>
                                <td className="tbody-td">{sku.sku}</td>
                                <td className="tbody-td">{sku.client}</td>
                                <td className="tbody-td">{sku.product}</td>
                                <td className="tbody-td">{sku.shift}</td>
                                <td className="tbody-td">{sku.performance}</td>
                                <td className="tbody-td"><span>{sku.accepted_percentage} %</span></td>
                                <td className="tbody-td">{sku.payment_method ? 'HORAS LINEA' : 'HORAS RENDIMIENTO'}</td>
                                <td className="tbody-td text-center">{sku.status ?
                                    <p className="bg-green-500 p-1 text-white font-bold">ACTIVO</p>
                                    :
                                    <p className="bg-red-500 p-1 text-white font-bold">INACTIVO</p>
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mb-10 flex justify-end">
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    handlePageChange={handlePageChange}
                />
            </div>

            <ModalEditLineSkuData modal={modal} setModal={setModal} sku={selectedSku} setSelectedSku={setSelectedSku} currentPage={currentPage} />

            <ModalCargaLineaSku modal={uploadModal} setModal={setUploadModal} currentPage={currentPage} />

            {isOpen && (
                <FiltersLineSku isOpen={isOpen} setIsOpen={setIsOpen} filters={filters} setFilters={setFilters} setSearchParams={setSearchParams} searchParams={searchParams} />
            )}
        </div>
    )
}
