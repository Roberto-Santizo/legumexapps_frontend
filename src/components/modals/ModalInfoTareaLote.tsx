import { SetStateAction } from 'react'
import { TaskForCalendar } from '@/api/TasksWeeklyPlanAPI'
import Modal from '../Modal'

type Props = {
    show: boolean,
    setModal: React.Dispatch<SetStateAction<boolean>>;
    setSelectedTask: React.Dispatch<SetStateAction<TaskForCalendar>>;
    task: TaskForCalendar;
}

export default function ModalInfoTareaLote({ show, setModal, task, setSelectedTask }: Props) {

    const handleClose = () => {
        setModal(false);
        setSelectedTask({} as TaskForCalendar);
    }

    return (
        <Modal modal={show} closeModal={() => handleClose()} title="Información de la Tarea">
            <div className="p-6 space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500">Tarea</p>
                        <p className="text-base font-semibold text-gray-800">{task.task}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Lote</p>
                        <p className="text-base font-semibold text-gray-800">{task.lote}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Finca</p>
                        <p className="text-base font-semibold text-gray-800">{task.finca}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">CDP</p>
                        <p className="text-base font-semibold text-gray-800">{task.cdp}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
