import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminDashboard from "./AdminDashboard";
import AgricolaDashboard from "./AgricolaDashboard";

export default function GeneralDashboard() {
  const [activeForm, setActiveForm] = useState<string>("A");

  return (
    <>
      <div className="relative">
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={() => setActiveForm("A")}
            className={`${activeForm === "A" ? 'bg-indigo-800' : 'bg-indigo-500'} button  hover:bg-indigo-700`}
          >
            Dashboard Administrador
          </button>
          <button
            onClick={() => setActiveForm("B")}
            className={`${activeForm === "B" ? 'bg-indigo-800' : 'bg-indigo-500'} button  hover:bg-indigo-700`}
          >
            Dashboard Agricola
          </button>
        </div>
        <AnimatePresence mode="wait">
          {activeForm === "A" ? (
            <motion.div
              key="formA"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <AdminDashboard />
            </motion.div>
          ) : (
            <motion.div
              key="formB"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <AgricolaDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
