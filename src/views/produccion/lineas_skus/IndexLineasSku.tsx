import { getPaginatedLineasSKU, LineaSKU } from "@/api/LineasSkuAPI";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import Pagination from "@/components/utilities-components/Pagination";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ModalEditLineSkuData from "@/components/modals/ModalEditLineSkuData";
import ModalCargaLineaSku from "@/components/modals/ModalCargaLineaSku";


export default function IndexLineasSku() {
    const [skus, setSkus] = useState<LineaSKU[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [modal, setModal] = useState<boolean>(false);
    const [selectedSku, setSelectedSku] = useState<LineaSKU>({} as LineaSKU);
    const [uploadModal, setUploadModal] = useState<boolean>(false);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedLineasSKU', currentPage],
        queryFn: () => getPaginatedLineasSKU(currentPage),
        placeholderData: keepPreviousData
    });

    useEffect(() => {
        if (data) {
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setSkus(data.data);
        }
    }, [data])


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
        </div>
    )
}
