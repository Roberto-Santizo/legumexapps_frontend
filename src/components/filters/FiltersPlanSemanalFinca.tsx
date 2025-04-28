import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllFincas } from "@/api/FincasAPI";
import { FiltersPlanSemanalType } from "@/views/agricola/planes-semanales/IndexPlanSemanal";
import Filters from "../Filters";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersPlanSemanalType>>;
    setTempFilters: Dispatch<SetStateAction<FiltersPlanSemanalType>>;
    tempFilters: FiltersPlanSemanalType;
}

const initialValues = {
    finca_id: "",
    week: "",
    year: ""
}

export default function FiltersPlanSemanalFinca({ isOpen, setIsOpen, setFilters, setTempFilters, tempFilters }: Props) {
    const { data: fincas } = useQuery({
        queryKey: ['getAllFincas'],
        queryFn: getAllFincas,
    });

    const filterFincas = fincas?.filter(finca => +finca.id < 7);

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setTempFilters(initialValues);
        setFilters(initialValues);
        setIsOpen(false);
    }
    return (
        <Filters isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="mt-5 space-y-5">
                <div>
                    <label className="block text-sm font-medium">Semana</label>
                    <input type="number" name="week" className="w-full border p-2 rounded" placeholder="Número de semana"
                        onChange={handleFilterTempChange} value={tempFilters.week}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Año</label>
                    <input type="number" name="year" className="w-full border p-2 rounded" placeholder="Año"
                        onChange={handleFilterTempChange} value={tempFilters.year}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Finca</label>
                    <select className="w-full border p-2 rounded" name="finca_id"
                        onChange={handleFilterTempChange} value={tempFilters.finca_id || ""}
                    >
                        <option value="">Todas</option>
                        {filterFincas?.map(finca => (
                            <option key={finca.id} value={finca.id}>{finca.name}</option>
                        ))}
                    </select>
                </div>

                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                        onClick={handleFilterData} >
                        Buscar
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleResetFilters} >
                        Borrar Filtros
                    </button>
                </div>
            </div>
        </Filters>
    )
}
