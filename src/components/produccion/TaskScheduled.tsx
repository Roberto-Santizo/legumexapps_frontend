import { TaskOperationDate } from "@/api/WeeklyProductionPlanAPI"
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Calendar, Clock } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import ModalChangeOperationDate from "../modals/ModalChangeOperationDate";

type Props = {
    task: TaskOperationDate;
    selectedId: string;
    selectedDate: string;
    setSelectedId: Dispatch<SetStateAction<TaskOperationDate['id']>>;
}
export default function TaskScheduled({ task, selectedId, setSelectedId, selectedDate }: Props) {
    const [modal, setModal] = useState<boolean>(false);

    return (
        <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
            <div className="p-6 space-y-2 text-gray-700 text-base leading-relaxed">
                <p><span className="font-semibold text-gray-900">SKU:</span> {task.sku}</p>
                <p><span className="font-semibold text-gray-900">Línea:</span> {task.line}</p>
                <p><span className="font-semibold text-gray-900">Total libras:</span> {task.total_lbs}</p>
                <p><span className="font-semibold text-gray-900">Destino:</span> {task.destination}</p>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
                {task.finished && (
                    <CheckBadgeIcon className='w-6 h-6 text-green-500' />
                )}

                {task.working && (
                    <Clock className='w-6 h-6 text-orange-500' />
                )}

                {(!task.finished && !task.working) && (
                    <div className="bg-gray-50 px-6 flex justify-end">
                        <button
                            onClick={() => {
                                setSelectedId(task.id);
                                setModal(true);
                            }}
                            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-all 
                                    bg-white hover:border-gray-400 hover:shadow-md text-gray-800'
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Cambiar fecha de operación</span>
                        </button>
                    </div>
                )}
            </div>

            <ModalChangeOperationDate modal={modal} setModal={setModal} selectedDate={selectedDate} selectedId={selectedId} />
        </div>
    )
}
