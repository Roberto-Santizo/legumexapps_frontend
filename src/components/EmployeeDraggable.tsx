import { EmployeeProduction } from '@/api/WeeklyProductionPlanAPI';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle, User, XCircleIcon } from 'lucide-react';

type Props = {
    employee: EmployeeProduction;
};

export default function EmployeeDraggable({ employee }: Props) {
    const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({
        id: employee.id,
        data: {
            type: "Employee",
            employee
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} className={`flex justify-between items-center gap-3 px-5 py-3 rounded-lg shadow-md border border-gray-300 bg-white text-gray-700 font-medium transition-all cursor-pointer select-none ${isDragging ? "opacity-50 shadow-sm" : "hover:bg-gray-100 hover:shadow-lg active:scale-95"}`}>

            <div className='flex items-center gap-3'>
                <div className="bg-indigo-500 text-white p-2 rounded-full">
                    <User size={18} />
                </div>
                <p className="text-sm">{employee.name}</p>
            </div>

            {employee.active ? (
                <CheckCircle className='text-green-500' />
            ) : (
                <XCircleIcon className='text-red-500' />
            )}
        </div>
    );
}
