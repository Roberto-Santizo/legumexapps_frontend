import { motion } from "framer-motion";
import { X } from "lucide-react";
import { TasksMasterFilters } from "../hooks/useTasksMasterFilters";
import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentFilters: TasksMasterFilters;
  onApply: (filters: TasksMasterFilters) => void;
  resetFilters: () => void;
}

export default function IndexFilters({ isOpen, setIsOpen, currentFilters, onApply, resetFilters }: Props) {
  const [localFilters, setLocalFilters] = useState<TasksMasterFilters>(currentFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  }

  const handleApply = () => {
    onApply(localFilters);
    setIsOpen(false);
  }

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters({ recipe: '', crop: '', week: '' });
    setIsOpen(false);
  }


  if (isOpen) return (
    <div className="relative">
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-4 flex flex-col"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button onClick={() => setIsOpen(false)} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-screen p-2 space-y-4">
          <div>
            <label className="block text-sm font-medium">Receta</label>
            <input type="text" name="recipe" className="w-full border p-2 rounded" placeholder="Receta"
              onChange={handleChange} value={localFilters.recipe} autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cultivo</label>
            <input type="text" name="crop" className="w-full border p-2 rounded" placeholder="Cultivo"
              onChange={handleChange} value={localFilters.crop} autoComplete="off"
            />
          </div>

            <div>
            <label className="block text-sm font-medium">Semana Aplicación</label>
            <input type="number" name="week" className="w-full border p-2 rounded" placeholder="Semana de aplicación"
              onChange={handleChange} value={localFilters.week} autoComplete="off"
            />
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
            onClick={() => handleApply()}
          >
            Aplicar Filtros
          </button>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            onClick={handleResetFilters}
          >
            Borrar Filtros
          </button>
        </div>
      </motion.div>
    </div>
  )
}
