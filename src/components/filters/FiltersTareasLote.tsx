import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Filters from "../Filters";
import { FiltersTareasLoteType } from "@/views/agricola/tareas-lote/IndexTareasLote";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersTareasLoteType>>;
    setTempFilters: Dispatch<SetStateAction<FiltersTareasLoteType>>;
    tempFilters: FiltersTareasLoteType;
}

const initialValues = {
    name: "",
    code: "",
    task_type: "",
}

export default function FiltersTareasLote({ isOpen, setIsOpen, setFilters, setTempFilters, tempFilters }: Props) {
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
        <Filters setIsOpen={setIsOpen} isOpen={isOpen}>
            <div className="mt-5 space-y-5">
                <div>
                    <label className="block text-sm font-medium">Tarea</label>
                    <input type="text" name="name" className="w-full border p-2 rounded" placeholder="Nombre de la tarea"
                        onChange={handleFilterTempChange} value={tempFilters.name}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Código</label>
                    <input type="text" name="code" className="w-full border p-2 rounded" placeholder="Código de la tarea"
                        onChange={handleFilterTempChange} value={tempFilters.code}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Tipo de Tarea</label>
                    <select className="w-full border p-2 rounded" name="task_type"
                        onChange={handleFilterTempChange} value={tempFilters.task_type || ""}
                    >
                        <option value="">Todas</option>
                        <option value="0">Planificadas</option>
                        <option value="1">Extraordinarias</option>
                    </select>
                </div>

                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                        onClick={handleFilterData}
                    >
                        Buscar
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleResetFilters}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </div>
        </Filters>
    )
}
