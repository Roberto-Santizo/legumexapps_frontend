import { Edit, PlusIcon, XIcon } from "lucide-react";
import { SetStateAction } from "react";
import { Link } from "react-router-dom";
import { TaskWeeklyPlanWithNoOperationDate } from "types/taskWeeklyPlanTypes";

type Props = {
    task: TaskWeeklyPlanWithNoOperationDate;
    ids: string[];
    setIds: React.Dispatch<SetStateAction<string[]>>;
}

export default function TaskCalendarFincaComponent({ task, setIds, ids }: Props) {
    const handleAddId = (id: string) => {
        if (ids.includes(id)) {
            setIds(ids.filter((item) => item !== id));
        } else {
            setIds([...ids, id]);
        }
    }
    return (
        <div className={`${ids.includes(task.id) ? 'bg-indigo-100' : ''} ${task.bg_color} cursor-pointer  transition-all  border-l-4 border-indigo-500 shadow-sm p-5 mb-3 rounded-md flex justify-between hover:shadow-md border`}>
            <div>
                <p className="text-indigo-700 font-semibold text-sm">{task.task}</p>
                <p className="text-gray-600 text-xs">{task.finca}</p>
                <p className="text-gray-600 text-xs">{task.lote}</p>
                <p className="text-gray-600 text-xs">{task.group}</p>
            </div>

            <div className="flex flex-col justify-between">
                {ids.includes(task.id) ? (
                    <XIcon className="w-5 h-5 cursor-pointer hover:text-red-500" onClick={() => handleAddId(task.id)} />
                ) : (
                    <PlusIcon className="w-5 h-5 cursor-pointer hover:text-gray-500" onClick={() => handleAddId(task.id)} />
                )}

                <Link to={`/planes-semanales/tareas-lote/editar/${task.id}`} target="_blank">
                    <Edit className="w-5 h-5 cursor-pointer hover:text-gray-500" />
                </Link>
            </div>

        </div>

    )
}
