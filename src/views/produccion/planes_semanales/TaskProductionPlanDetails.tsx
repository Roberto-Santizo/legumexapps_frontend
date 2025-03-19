import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskProductionInProgressDetail } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function TaskProductionPlanDetails() {
    const params = useParams();
    const task_p_id = params.task_p_id!!;

    const { data: task, isLoading, isError } = useQuery({
        queryKey: ['getTaskProductionInProgressDetail', task_p_id],
        queryFn: () => getTaskProductionInProgressDetail(task_p_id)
    });

    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />
    if (task) return (
        <div>
            <h2 className="font-bold text-4xl">Infomación de Tarea </h2>

            <div className="p-5 grid grid-cols-2 mt-5">
                <div>
                    <p className="font-bold text-2xl">SKU: {task.data.sku}</p>
                    <p className="font-bold text-2xl">Linea: {task.data.line}</p>
                </div>

            </div>


            <table className="table mt-5">
                <thead>
                    <tr className="thead-tr">
                        <th className="thead-th">CODIGO</th>
                        <th className="thead-th">NOMBRE</th>
                        <th className="thead-th">POSICIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {task.data.employees.map(employee => (
                        <tr className="tbody-tr">
                            <td className="tbody-td">{employee.code}</td>
                            <td className="tbody-td">{employee.name}</td>
                            <td className="tbody-td">{employee.position}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
