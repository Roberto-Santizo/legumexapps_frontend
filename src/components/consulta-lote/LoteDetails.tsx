import { EyeIcon } from "lucide-react";
import { loteCDPDetails } from "@/types";
import { formatDate } from "@/helpers";
import TaskLabel from "../utilities-components/TaskLabel";

type Props = {
    data: loteCDPDetails
}

export default function LoteDetails({ data }: Props) {
    return (
        <div className="space-y-5">
            <div className="mt-10 shadow-xl p-5">
                <h2 className="text-center text-xl font-bold uppercase">
                    Información del Lote
                </h2>
                <TaskLabel label="Control de Plantación" text={data.data_lote.cdp} />
                <TaskLabel label="Fecha de Incio" text={formatDate(data.data_lote.start_date_cdp)} />
                <TaskLabel label="Fecha Final" text={data.data_lote.end_date_cdp ? formatDate(data.data_lote.start_date_cdp) : 'SIN CIERRE'} />
            </div>

            <div className="space-y-5">
                {Object.entries(data.data).map(([week, tasks]) => (
                    <div key={week} className="p-5">
                        <h1
                            className="font-bold text-center uppercase text-xl mb-5"
                        >
                            Semana {week} <span className="text-xs">(Calendario)</span>
                        </h1>
                        <table className="table">
                            <thead>
                                <tr className="thead-tr">
                                    <th scope="col" className="thead-th">
                                        TAREA
                                    </th>
                                    <th scope="col" className="thead-th">
                                        ESTADO
                                    </th>
                                    <th scope="col" className="thead-th">
                                        Semana de Aplicación
                                    </th>
                                    <th scope="col" className="thead-th">
                                        HORAS TEORICAS
                                    </th>
                                    <th scope="col" className="thead-th">
                                        HORAS REALES
                                    </th>
                                    <th scope="col" className="thead-th">
                                        RENDIMIENTO
                                    </th>
                                    <th scope="col" className="thead-th">
                                        ACCIONES
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="font-bold">
                                {tasks.map((task) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>

    )
}
