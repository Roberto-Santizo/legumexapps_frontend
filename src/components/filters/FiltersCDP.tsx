import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Filters from "../Filters";
import { FiltersCDPType } from "@/views/agricola/cdps/Index";

type Props = {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    setFilters: Dispatch<SetStateAction<FiltersCDPType>>;
    setTempFilters: Dispatch<SetStateAction<FiltersCDPType>>;
    tempFilters: FiltersCDPType;
}

export default function FiltersCDP({ isOpen, setIsOpen, setFilters, setTempFilters, tempFilters }: Props) {
    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setTempFilters({ cdp: '', end_date: '', start_date: '' });
        setFilters({ cdp: '', end_date: '', start_date: '' });
        setIsOpen(false);
    }
    return (
        <Filters isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="mt-5 space-y-5">
                <div>
                    <label className="block text-sm font-medium">CDP</label>
                    <input type="text" name="cdp" className="w-full border p-2 rounded" placeholder="Nombre del CDP"
                        onChange={handleFilterTempChange} value={tempFilters.cdp}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Fecha de Inicio</label>
                    <input type="date" name="start_date" className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.start_date}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Fecha Final</label>
                    <input type="date" name="end_date" className="w-full border p-2 rounded"
                        onChange={handleFilterTempChange} value={tempFilters.end_date}
                    />
                </div>
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
        </Filters>
    )
}
