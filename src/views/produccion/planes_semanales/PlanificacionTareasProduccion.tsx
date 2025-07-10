import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { getLineas } from '@/api/LineasAPI';
import { usePermissions } from '@/hooks/usePermissions';
import { getCurrentDate } from '@/helpers';
import { getWeeklyProductionPlanEvents } from '@/api/WeeklyProductionPlanAPI';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import Spinner from '@/components/utilities-components/Spinner';
import TasksWithNoOperationDate from '@/components/produccion/TasksWithNoOperationDate';
import TasksWithOperationDate from '@/components/produccion/TasksWithOperationDate';
import ModalCrearTareaProduccion from '@/components/modals/ModalCrearTareaProduccion';
import HoverSummaryHoursPerLine from '@/components/ui/HoverSummaryHoursPerLine';
import ModalReprogramTaskProduction from '@/components/modals/ModalReprogramTaskProduction';

type DateClickInfo = {
  dateStr: string;
}

export type TaskProductionUnscheduledFilters = {
  sku: string;
  line: string;
}


export default function CalendarTasks() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const params = useParams();
  const plan_id = params.plan_id!!;
  const navigate = useNavigate();

  const { hasPermission } = usePermissions();

  const { data: events, isFetching } = useQuery({
    queryKey: ['getWeeklyProductionPlanEvents', plan_id],
    queryFn: () => getWeeklyProductionPlanEvents(plan_id),
    refetchOnWindowFocus: false
  });

  const { data: lines } = useQuery({
    queryKey: ['getLineas'],
    queryFn: () => getLineas({ page: 1, paginated: '' }),
  });

  const handleClickDate = (info: DateClickInfo) => {
    navigate(`${location.pathname}?date=${info.dateStr}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full">
        <h1 className="font-bold text-4xl mb-4">Planificación Producción</h1>
      </div>

      {hasPermission('administrate plans production') && (
        <div className='flex justify-end'>
          <button className='button bg-blue-500 flex gap-2' onClick={() => navigate(`${location.pathname}?newTask=true`)}>
            <PlusIcon />
            Crear Tarea Producción
          </button>
        </div>
      )}

      <div className="flex gap-5 p-5">
        <div className="flex-1 border p-5 rounded-lg bg-white shadow max-h-screen overflow-y-auto scrollbar-hide space-y-6">
          <div className="min-h-[600px] relative">
            {isFetching && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg flex-col gap-2">
                <Spinner />
                <p className='text-xl text-gray-500'>Cargando calendario...</p>
              </div>
            )}

            {!isFetching && (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={[...(events ?? [])]}
                locale={esLocale}
                dateClick={handleClickDate}
                dayCellClassNames={(arg) =>
                  arg.date.toISOString().split('T')[0] === (date ?? getCurrentDate())
                    ? ['bg-indigo-200']
                    : []
                }
              />

            )}
          </div>

          <TasksWithOperationDate lines={lines?.data ?? []} />
        </div>


        {hasPermission('administrate plans production') && (
          <TasksWithNoOperationDate lines={lines?.data ?? []} />
        )}
      </div>

      <ModalCrearTareaProduccion />

      <ModalReprogramTaskProduction />

      {hasPermission('administrate plans production') && (
        <HoverSummaryHoursPerLine />
      )}
    </div>
  )
}
