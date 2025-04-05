import { NoteTaskProduction } from "@/api/WeeklyProductionPlanAPI";
import * as HoverCard from "@radix-ui/react-hover-card";
import { AlertCircleIcon } from "lucide-react";

type Props = {
    note: NoteTaskProduction | null;
}

const HoverCardNote = ({ note }: Props) => (
    <HoverCard.Root>
        <HoverCard.Trigger asChild>
            <AlertCircleIcon className="text-red-500 mt-5" />
        </HoverCard.Trigger>
        <HoverCard.Portal>
            <HoverCard.Content
                className="w-[800px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                sideOffset={5}
            >
                <div className="space-y-4 p-4 bg-white rounded-lg">
                    {note ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800">Nota</h2>
                            <p className="text-gray-600"><span className="font-bold">Razón: </span>{note.reason}</p>
                            <p className="text-gray-600"><span className="font-bold">Acción tomada: </span>{note.action}</p>
                            <p className="text-gray-600"><span className="font-bold">Nota realizada por: </span>{note.user}</p>
                        </>
                    ) : (
                        <> 
                            <h2 className="text-xl font-semibold text-gray-800">No hay notas disponibles</h2>
                            <p className="text-gray-600">La nota no ha sido ingresada.</p>
                        </>
                    )}



                </div>
                <HoverCard.Arrow className="fill-white" />
            </HoverCard.Content>
        </HoverCard.Portal>
    </HoverCard.Root>
);

export default HoverCardNote;
