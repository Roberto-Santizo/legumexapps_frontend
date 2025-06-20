import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { getLineas } from '@/api/LineasAPI';
import { getWeeklyProductionPlanEvents } from '@/api/WeeklyProductionPlanAPI';
import ModalCrearTareaProduccion from '@/components/modals/ModalCrearTareaProduccion';
import TasksWithNoOperationDate from '@/components/produccion/TasksWithNoOperationDate';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import TasksWithOperationDate from '@/components/produccion/TasksWithOperationDate';

type DateClickInfo = {
  dateStr: string;
}


export default function CalendarTasks() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const params = useParams();
  const plan_id = params.plan_id!!;
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>(date);

  const { data: events } = useQuery({
    queryKey: ['getWeeklyProductionPlanEvents', plan_id],
    queryFn: () => getWeeklyProductionPlanEvents(plan_id),
  });

  const { data: lines } = useQuery({
    queryKey: ['getLineas'],
    queryFn: () => getLineas({ page: 1, paginated: '' }),
  });

  const handleClickDate = (info: DateClickInfo) => {
    navigate(`${location.pathname}?date=${info.dateStr}`);
    setSelectedDate(info.dateStr);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full">
        <h1 className="font-bold text-4xl mb-4">Planificación Producción</h1>
      </div>

      <div className='flex justify-end'>
        <button className='button bg-indigo-500 flex gap-2' onClick={() => navigate(`${location.pathname}?newTask=true`)}>
          <PlusIcon />
          Crear Tarea Producción
        </button>
      </div>

      <div className="flex gap-5 p-5">
        <div className="flex-1 border p-5 rounded-lg bg-white shadow max-h-screen overflow-y-auto scrollbar-hide space-y-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale={esLocale}
            dateClick={handleClickDate}
            dayCellClassNames={(arg) =>
              arg.date.toISOString().split('T')[0] === selectedDate
                ? ['bg-indigo-200']
                : []
            }
          />

          <TasksWithOperationDate date={selectedDate} lines={lines?.data ?? []} />
        </div>

        <TasksWithNoOperationDate lines={lines?.data ?? []} />
      </div>

      <ModalCrearTareaProduccion date={date}/>
    </div>
  )
}
