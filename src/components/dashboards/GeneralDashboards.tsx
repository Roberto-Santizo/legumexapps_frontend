import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminDashboard from "./AdminDashboard";
import AgricolaDashboard from "./AgricolaDashboard";
import LogisticsDashboard from "./LogisticsDashboard";

const tabs = [
  { id: "A", label: "Administrador", component: <AdminDashboard /> },
  { id: "B", label: "Agrícola", component: <AgricolaDashboard /> },
  { id: "C", label: "Logística", component: <LogisticsDashboard /> },
];

export default function GeneralDashboard() {
  const [activeForm, setActiveForm] = useState<string>("A");

  return (
    <div className="relative p-4 bg-white rounded-lg space-y-5">
      <div className="flex flex-col lg:flex-row gap-2 xl:justify-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveForm(tab.id)}
            className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-colors duration-200 ${activeForm === tab.id ? "bg-indigo-800" : "bg-indigo-500 hover:bg-indigo-600"
              }`}
          >
            {`Dashboard ${tab.label}`}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tabs.map(
          (tab) =>
            activeForm === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full"
              >
                {tab.component}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}
