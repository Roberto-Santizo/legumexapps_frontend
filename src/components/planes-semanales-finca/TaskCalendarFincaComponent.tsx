import { TaskWeeklyPlanForCalendar } from "@/api/TasksWeeklyPlanAPI"
import { SetStateAction } from "react";

type Props = {
    task: TaskWeeklyPlanForCalendar;
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
        <div
            className={`${ids.includes(task.id) ? 'bg-indigo-200' : ''} ${task.bg_color} cursor-pointer  border-l-4 border-indigo-500 shadow-sm p-3 mb-3 rounded-md hover:shadow-md transition-shadow`}
            onClick={() => handleAddId(task.id)}
        >
            <p className="text-indigo-700 font-semibold text-sm">{task.task}</p>
            <p className="text-gray-600 text-xs">{task.finca}</p>
            <p className="text-gray-600 text-xs">{task.lote}</p>
        </div>

    )
}
