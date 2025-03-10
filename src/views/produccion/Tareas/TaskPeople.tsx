import { useState } from "react";
import { User } from "lucide-react";

export default function TaskPeople() {
    const [fijos, setFijos] = useState(["Marcos", "CARLOS HERNANDEZ"]);
    const [comodines, setComodines] = useState(["CARLOS Prueba"]);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (item: string) => {
        setDraggedItem(item);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (target: "fijos" | "comodines") => {
        if (!draggedItem) return;
        moveItem(draggedItem, target);
        setDraggedItem(null);
    };

    const moveItem = (item: string, target: "fijos" | "comodines") => {
        if (target === "fijos" && !fijos.includes(item)) {
            setFijos((prev) => [...prev, item]);
            setComodines((prev) => prev.filter((i) => i !== item));
        } else if (target === "comodines" && !comodines.includes(item)) {
            setComodines((prev) => [...prev, item]);
            setFijos((prev) => prev.filter((i) => i !== item));
        }
    };

    return (
        <div className="space-y-10">
            <h1 className="font-bold text-4xl">Informacion de tareas con su personal asignado</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl p-10 text-xl">
                <div className="font-bold">Linea: <span className="font-normal ml-2">Insertar dato aquí</span></div>
                <div className="font-bold">Fecha de operación: <span className="font-normal ml-2">Insertar dato aquí</span></div>
                <div className="font-bold">Total de tarimas: <span className="font-normal ml-2">Insertar dato aquí</span></div>
                <div className="font-bold">SKU: <span className="font-normal ml-2">Insertar dato aquí</span></div>
                <div className="font-bold">Linea: <span className="font-normal ml-2">Insertar dato aquí</span></div>
                <div className="font-bold">Tarimas: <span className="font-normal ml-2">Insertar dato aquí</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div
                    className="p-6 bg-white shadow-lg rounded-lg"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("comodines")}
                >
                    <h3 className="mt-4 text-gray-700 font-bold uppercase">Comodines</h3>
                    <div className="mt-2 space-y-2">
                        {comodines.map((item) => (
                            <div
                                key={item}
                                draggable="true"
                                onDragStart={() => handleDragStart(item)}
                                onClick={() => moveItem(item, "fijos")}
                                className="flex items-center gap-2 bg-blue-600 text-white rounded-lg p-3 shadow-md cursor-pointer"
                            >
                                <User size={20} />
                                <p className="font-bold uppercase">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="p-6 bg-white shadow-lg rounded-lg"
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop("fijos")}
                >
                    <h3 className="mt-4 text-gray-700 font-bold uppercase">Fijos</h3>
                    <div className="mt-2 space-y-2">
                        {fijos.map((item) => (
                            <div
                                key={item}
                                draggable="true"
                                onDragStart={() => handleDragStart(item)}
                                onClick={() => moveItem(item, "comodines")}
                                className="flex items-center gap-2 bg-blue-600 text-white rounded-lg p-3 shadow-md cursor-pointer"
                            >
                                <User size={20} />
                                <p className="font-bold uppercase">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}




