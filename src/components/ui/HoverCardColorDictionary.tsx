import * as HoverCard from "@radix-ui/react-hover-card";
import { AlertCircleIcon } from "lucide-react";

const legendItems = [
    { color: "bg-green-500", label: "Tareas Terminadas" },
    { color: "bg-yellow-500", label: "Tareas En Proceso" },
    { color: "bg-red-500", label: "Tareas Pendientes" },
];


const HoverCardColorDictionary = () => (
    <HoverCard.Root>
        <HoverCard.Trigger asChild>
            <AlertCircleIcon />
        </HoverCard.Trigger>
        <HoverCard.Portal>
            <HoverCard.Content
                className="w-[250px] z-50 rounded-md bg-white p-5 shadow-lg data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                sideOffset={5}
            >
                <h2 className="text-xl font-semibold text-center mb-4 border-b pb-2">Diccionario de Colores</h2>
                <div className="space-y-4">
                    {legendItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${item.color}`} />
                            <p className="text-gray-700 text-sm">{item.label}</p>
                        </div>
                    ))}
                </div>
                <HoverCard.Arrow className="fill-white" />
            </HoverCard.Content>
        </HoverCard.Portal>
    </HoverCard.Root>
);

export default HoverCardColorDictionary;
