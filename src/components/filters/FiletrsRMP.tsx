import { Finca, getFincas } from "@/api/FincasAPI";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { getQualityStatuses, QualityStatus } from "@/api/ReceptionsDocAPI";
import Filters from "../Filters";
import { useQueries } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";

type Props = {
    filters: FiltersBoletaRMP;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersBoletaRMP>>;
    isOpen: boolean;
};

export type FiltersBoletaRMP = {
    finca_id: string,
    date: string,
    plate: string,
    quality_status_id: string,
    ref_doc: string,
    grn: string,
}

export const FiletrsBoletaRMPInitialValues: FiltersBoletaRMP = {
    finca_id: '',
    date: '',
    plate: '',
    quality_status_id: '',
    ref_doc: '',
    grn: ''
}

export default function FiltersRMP({ isOpen, setIsOpen, filters, setFilters }: Props) {
    const [fincas, setFincas] = useState<Finca[]>([]);
    const [statuses, setStatuses] = useState<QualityStatus[]>([]);
    const [tempFilters, setTempFilters] = useState<FiltersBoletaRMP>({} as FiltersBoletaRMP);

    const results = useQueries({
        queries: [
            { queryKey: ['getAllFincas'], queryFn: getFincas },
            { queryKey: ['getQualityStatuses'], queryFn: getQualityStatuses }
        ]
    });

    useEffect(() => {
        if (results.every(result => result.data)) {
            setFincas(results[0].data || []);
            setStatuses(results[1].data || []);
        }
    }, [results]);

    const isLoading = results.some(result => result.isLoading);

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(FiletrsBoletaRMPInitialValues);
        setIsOpen(false);
    };

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    return (
        <Filters isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="flex-1 overflow-y-auto max-h-screen p-2 space-y-4">
                <div>
                    <label className="block text-sm font-medium">Fecha</label>
                    <input type="date" name="date" className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.date || ""} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Placa</label>
                    <input name="plate" placeholder="Ej. C123ABC" type="text"
                        className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.plate || ""} />
                </div>

                <div>
                    <label className="block text-sm font-medium">GRN</label>
                    <input name="grn" placeholder="Ej. LT0001" type="text"
                        className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.grn || ""} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Documento Referencia</label>
                    <input name="ref_doc" placeholder="Ej. LT0001" type="text"
                        className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.ref_doc || ""} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Finca</label>
                    <select className="w-full border p-2 rounded" name="finca_id"
                        onChange={handleFilterTempChange} value={tempFilters.finca_id || ""}>
                        <option value="">Todas</option>
                        {fincas.map(finca => (
                            <option key={finca.id} value={finca.id}>{finca.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Estado</label>
                    <select className="w-full border p-2 rounded" name="quality_status_id"
                        onChange={handleFilterTempChange} value={tempFilters.quality_status_id || ""}>
                        <option value="">Todas</option>
                        {statuses.map(status => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="border-t pt-3 space-y-2">
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                    onClick={handleFilterData} disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Filtrar"}
                </button>

                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    onClick={handleResetFilters} disabled={isLoading}>
                    Borrar Filtros
                </button>
            </div>
        </Filters>
    );
}
