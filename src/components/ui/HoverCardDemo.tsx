import * as HoverCard from "@radix-ui/react-hover-card";
import { TableCell } from "@/components/ui/table";
import { TableRow } from "@mui/material";
import { TaskProductionEmployee } from "@/api/WeeklyProductionPlanAPI";
import { AlertCircleIcon } from "lucide-react";

type Props = {
    employee: TaskProductionEmployee;
}

const HoverCardDemo = ({ employee }: Props) => (
    <HoverCard.Root>
        <HoverCard.Trigger asChild>
            <TableRow className="hover:bg-gray-100 transition-all">
                <TableCell>{employee.code}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                    {employee.bitacoras.length > 0 && (
                        <AlertCircleIcon className="text-red-500" />
                    )}
                </TableCell>
            </TableRow>
        </HoverCard.Trigger>
        <HoverCard.Portal>
            <HoverCard.Content
                className="w-[800px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                sideOffset={5}
            >
                <div className="space-y-4 p-4 bg-white rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Bitácoras de {employee.position}</h2>
                    <div className="divide-y divide-gray-300">
                        {employee.bitacoras.length === 0 ? (
                            <p className="text-center">No existen cambios en esta posición</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr className="thead-tr">
                                        <th className="thead-tr">Empleado Original</th>
                                        <th className="thead-tr">Posicion Original</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employee.bitacoras.map((bitacora) => (
                                        <tr className="tbody-tr" key={bitacora.id}>
                                            <td className="tbody-td">{bitacora.original_name}</td>
                                            <td className="tbody-td">{bitacora.original_position}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}


                    </div>
                </div>
                <HoverCard.Arrow className="fill-white" />
            </HoverCard.Content>
        </HoverCard.Portal>
    </HoverCard.Root>
);

export default HoverCardDemo;
