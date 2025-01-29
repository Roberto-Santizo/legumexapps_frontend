import { Dispatch, SetStateAction, useState } from "react";
import { EmployeeCrop } from "../types";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

type Props = {
  assignment: EmployeeCrop;
  setDataEmployees: Dispatch<SetStateAction<EmployeeCrop[]>>;
};

export default function EmployeeTaskCrop({
  assignment,
  setDataEmployees,
}: Props) {
  const [inputValue, setInputValue] = useState(assignment.lbs ?? 0);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    if(inputValue <= 0){
        toast.error('Las libras deben ser mayor a 0');
        return;
    }
    setDataEmployees((prev) =>
      prev.map((item) =>
        item.id === assignment.id ? { ...item, lbs: inputValue } : item
      )
    );
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) | 0;
    setInputValue(value);
  };

  return (
    <div className="p-5 flex justify-between shadow">
      <div>
        <p className="font-medium">{assignment.name}</p>
        <p className="font-medium">{assignment.code}</p>
      </div>
      <div className="flex flex-col">
        {assignment.lbs || showSaved ? (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xl"
            >
                <span className="font-bold ">{inputValue}</span> libras
            </motion.p>
        ) : (
          <div className="flex flex-col">
            <input
              type="number"
              className="border border-black p-2"
              placeholder="Toma en libras"
              onChange={handleChange}
            />
            <button
              className="button bg-indigo-500 hover:bg-indigo-600 mt-2"
              onClick={() => handleSave()}
            >
              <p>Guardar Libras</p>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
