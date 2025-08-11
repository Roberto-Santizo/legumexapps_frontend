import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FiltersInsumosType } from "@/views/agricola/supplies/Index";
import Filters from "../Filters";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  setFilters: Dispatch<SetStateAction<FiltersInsumosType>>;
  setTempFilters: Dispatch<SetStateAction<FiltersInsumosType>>;
  tempFilters: FiltersInsumosType;
};


export default function FiltersInsumos({ setIsOpen, isOpen, setFilters, setTempFilters, tempFilters }: Props) {
  const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterData = () => {
    setFilters(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setTempFilters({ code: '', name: '' });
    setFilters({ code: '', name: '' });
    setIsOpen(false);
  }

  return (
    <Filters isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="mt-5">
        <label className="block text-sm font-medium">Código</label>
        <input type="text" name="code" className="w-full border p-2 rounded" placeholder="Ej. INS00001"
          onChange={handleFilterTempChange} value={tempFilters.code}
          autoComplete="off"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium">Nombre</label>
        <input type="text" name="name" className="w-full border p-2 rounded" placeholder="Nombre del insumo"
          onChange={handleFilterTempChange} value={tempFilters.name}
          autoComplete="off"
        />
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
