import * as HoverCard from "@radix-ui/react-hover-card";
import { EyeIcon } from "lucide-react";
import { TaskCDP } from "@/types/taskWeeklyPlanTypes";

type Props = {
    task: TaskCDP;
}

const HoverCardInsumos = ({ task }: Props) => (
    <HoverCard.Root>
        <HoverCard.Trigger asChild>
            <tr className="tbody-tr" key={task.id}>
                <td className="tbody-td">{task.task}</td>
                <td className="tbody-td uppercase  text-center font-bold text-white">{task.closed ? <p className="bg-green-500">CERRADA</p> : <p className="bg-red-500">SIN CIERRE</p>}</td>
                <td className="tbody-td">{(task.aplication_week)}</td>
                <td className="tbody-td">{task.hours}</td>
                <td className="tbody-td">{task.real_hours ?? 0}</td>
                <td className="tbody-td">{task.performance ?? 0} %</td>
                <td className="tbody-td">
                    {task.closed ? (
                        <EyeIcon className="cursor-pointer hover:text-gray-500" onClick={() => {
                            window.open(
                                `/planes-semanales/tareas-lote/informacion/${task.id}`,
                            );
                        }} />
                    ) : <></>}
                </td>
            </tr>
        </HoverCard.Trigger>
        <HoverCard.Portal>
            <HoverCard.Content
                className="w-[1000px] z-50 rounded-md bg-white p-5 shadow-lg data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                sideOffset={5}
            >
                <div className="space-y-4 p-4 bg-white rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">Insumos Utilizados </h2>
                    <div className="divide-y divide-gray-300">
                        {task.insumos.length === 0 ? (
                            <p className="text-center">No existen insumos relacionados</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr className="thead-tr">
                                        <th className="thead-tr">Insumo</th>
                                        <th className="thead-tr">Cantidad Asignada</th>
                                        <th className="thead-tr">Cantidad Utilizada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {task.insumos.map((insumo) => (
                                        <tr className="tbody-tr" key={insumo.id}>
                                            <td className="tbody-td">{insumo.name}</td>
                                            <td className="tbody-td">{`${insumo.assigned_quantity} ${insumo.measure}`}</td>
                                            <td className="tbody-td">{`${insumo.used_quantity} ${insumo.measure}`}</td>
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

export default HoverCardInsumos;
