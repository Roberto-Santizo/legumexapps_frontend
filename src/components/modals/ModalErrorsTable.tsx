import { Dispatch, SetStateAction } from "react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertCircleIcon, FileSymlink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalRadixUI from "../ModalRadixUI";

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    errors: string[];
};

export default function ModalErrorsTable({ modal, setModal, errors }: Props) {

    const navigate = useNavigate();

    const handleCloseModal = () => {
        setModal(false);
        navigate('/planes-produccion');
    };

    const handleExportExcel = () => {
        const data = errors.map((error, index) => ({
            N: index + 1,
            Error: error,
        }))

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Errores');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const fileData = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(fileData, 'Errores Importación.xlsx');
    };

    return (
        <ModalRadixUI modal={modal} closeModal={handleCloseModal} title="Errores al importar el archivo" width="w-2/3">
                <div className="mt-4 p-6 space-y-6">
                    <div className="flex items-center gap-3 bg-yellow-100 border border-yellow-300 p-4 rounded-lg shadow-sm">
                        <AlertCircleIcon className="text-yellow-600 w-5 h-5" />
                        <p className="text-yellow-800 font-medium text-base">Plan creado con advertencias:</p>
                    </div>

                    <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <table className="min-w-full text-sm text-left text-gray-800">
                            <thead className="bg-gray-100 sticky top-0 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600 w-12">#</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Mensaje de error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errors.map((error, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                                        <td className="px-4 py-2">{error}</td>
                                    </tr>
                                ))}
                                {errors.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-4 text-center text-gray-500">
                                            No hay errores para mostrar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleExportExcel}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition"
                        >
                            <FileSymlink className="w-4 h-4" />
                            Exportar
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition"
                        >
                            Seguir
                        </button>
                    </div>
                </div>
        </ModalRadixUI>

    )
}
