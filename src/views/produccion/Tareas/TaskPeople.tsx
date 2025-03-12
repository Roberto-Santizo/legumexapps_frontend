import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function TaskPeople() {

    const employeeData = {
        fijos: ["Juan", "Pedro"],
        comodines: ["María", "Ana", "Luis", "Carlos"],
    };
    const [fijos, setFijos] = useState<string[]>([]);
    const [comodines, setComodines] = useState<string[]>([]);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [targetGroup, setTargetGroup] = useState<"fijos" | "comodines" | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [itemToMove, setItemToMove] = useState<string | null>(null);

    // Simular la carga de datos como si vinieran de la API
    useEffect(() => {
        setFijos(employeeData.fijos);
        setComodines(employeeData.comodines);
    }, []);

    const handleDragStart = (item: string) => {
        setDraggedItem(item);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (target: "fijos" | "comodines") => {
        if (!draggedItem) return;

        const listToReplace = target === "fijos" ? fijos : comodines;

        if (listToReplace.length >= 1) {
            setTargetGroup(target);
            setItemToMove(draggedItem);
            setShowModal(true);
        } else {
            moveItem(draggedItem, target, listToReplace[0]);
        }
    };

    const moveItem = (item: string, target: "fijos" | "comodines", replaceItem: string) => {
        if (!item || !replaceItem) return;

        if (target === "fijos") {
            setFijos((prev) => prev.map((i) => (i === replaceItem ? item : i)));
            setComodines((prev) => prev.map((i) => (i === item ? replaceItem : i)));
        } else {
            setComodines((prev) => prev.map((i) => (i === replaceItem ? item : i)));
            setFijos((prev) => prev.map((i) => (i === item ? replaceItem : i))); 
        }


        setDraggedItem(null);
        setItemToMove(null);
        setShowModal(false);
    };

    return (
        <div className="space-y-10">
            <h1 className="font-bold text-4xl">Información de tareas con su personal asignado</h1>
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
                                className="flex items-center gap-2 bg-blue-600 text-white rounded-lg p-3 shadow-md cursor-pointer"
                            >
                                <User size={20} />
                                <p className="font-bold uppercase">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal para reemplazo */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Selecciona a quién reemplazar</h2>
                        <div className="space-y-2">
                            {(targetGroup === "fijos" ? fijos : comodines).map((item) => (
                                <button
                                    key={item}
                                    onClick={() => moveItem(itemToMove as string, targetGroup as "fijos" | "comodines", item)}
                                    className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
