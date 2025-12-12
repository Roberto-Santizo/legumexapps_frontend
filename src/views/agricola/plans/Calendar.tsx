import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { Bars3Icon } from '@heroicons/react/16/solid';
import { Archive, PlusIcon, Trash, UploadIcon, UserIcon, XIcon } from 'lucide-react';
import { deleteEmployeeAssignment, getFincaGroups, getPlanificationEmployee, getTasksForCalendar, getTasksNoPlanificationDate } from '@/api/TasksWeeklyPlanAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { getLotes } from '@/api/LotesAPI';
import { getTasks } from '@/api/TasksAPI';
import { FiltersTasksInitialValues } from '../tasks/Index';
import { TaskWeeklyPlanForCalendar } from '@/types/taskWeeklyPlanTypes';
import { TaskGeneral } from '@/types/taskGeneralType';
import { Lote } from '@/types/lotesType';
import Select from "react-select";
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import ModalChangeOperationDateAgricola from '@/components/modals/ModalChangeOperationDateAgricola';
import ModalInfoTareaLote from '@/components/modals/ModalInfoTareaLote';
import ModalInsumosPrepared from '@/components/modals/ModalInsumosPrepared';
import Spinner from '@/components/utilities-components/Spinner';
import TaskCalendarFincaComponent from '@/components/planes-semanales-finca/TaskCalendarFincaComponent';
import { useNotification } from '../../../core/notifications/NotificationContext';
import ModalUploadAgricolaAssignments from '@/components/modals/ModalUploadAgricolaAssignments';
import ModalCreateFincaGroup from '@/components/modals/ModalCreateFincaGroup';
import ModalAssignGroup from '@/components/modals/ModalAssignGroup';
import debounce from "debounce";

interface DateClickInfo {
    dateStr: string;
}

export default function Calendar() {
    const queryClient = useQueryClient();
    const params = useParams();
    const id = params.plan_id!;
    const fincaId = params.finca_id!;

    const [ids, setIds] = useState<string[]>([]);
    const [seeTasks, setSeeTasks] = useState(false);
    const [seePersonal, setSeePersonal] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalInfoTarea, setModalInfoTarea] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskWeeklyPlanForCalendar>({} as TaskWeeklyPlanForCalendar);
    const [loteId, setLoteId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [view, setView] = useState(1);
    const [tareas, setTareas] = useState<TaskGeneral[]>([]);
    const { hasPermission } = usePermissions();
    const [assignmentIds, setAssignmentIds] = useState<number[]>([]);
    const [filterEmployee, setFilterEmployee] = useState<string>('');
    const [queryEmployee, setQueryEmployee] = useState<string>('');

    const calendarRef = useRef<FullCalendar | null>(null);
    const navigate = useNavigate();
    const notify = useNotification();

    const results = useQueries({
        queries: [
            { queryKey: ['getLotes'], queryFn: () => getLotes({ page: 1, filters: { name: "", cdp: "", finca_id: fincaId }, paginated: '' }) },
            { queryKey: ['getTasks'], queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: '' }) },
        ]
    });

    const debouncedChange = useCallback(
        debounce((value: string) => {
            setFilterEmployee(value);
        }, 750),
        []
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQueryEmployee(e.target.value);
        debouncedChange(e.target.value);
    };

    useEffect(() => {
        if (results[0].data) setLotes(results[0].data.data)
        if (results[1].data) setTareas(results[1].data.data)
    }, [results])

    const lotesOptions = lotes.map((lote) => ({
        value: lote.id,
        label: lote.name,
    }));

    const tareasOptions = tareas.map((lote) => ({
        value: lote.id,
        label: `${lote.code} ${lote.name}`,
    }));

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['getTasksNoPlanificationDate', id, loteId, taskId],
        queryFn: () => getTasksNoPlanificationDate({ id, loteId, taskId }),
    });

    const { data: employees, isLoading: isLoadingEmployees } = useQuery({
        queryKey: ['getPlanificationEmployee', id, loteId, filterEmployee],
        queryFn: () => getPlanificationEmployee({ id, loteId, filterEmployee }),
    });

    const { data: groups, isLoading: isLoadingGroups } = useQuery({
        queryKey: ['getFincaGroups', fincaId],
        queryFn: () => getFincaGroups(fincaId),
    });

    const { data: tasksForCalendar } = useQuery({
        queryKey: ['getTasksForCalendar', id],
        queryFn: () => getTasksForCalendar(id),
    });

    const { mutate: deleteEmployee } = useMutation({
        mutationFn: deleteEmployeeAssignment,
        onSuccess: (data) => {
            notify.success(data ?? '');
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
        },
        onError: (error) => {
            notify.error(error.message)
        },
    });

    useEffect(() => {
        if (tasksForCalendar) {
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi && tasksForCalendar.initial_date) {
                calendarApi.gotoDate(tasksForCalendar.initial_date);
            }
        }
    }, [tasksForCalendar]);



    const handleOpenDate = (info: DateClickInfo) => {
        navigate(`${location.pathname}?date=${info.dateStr}`);
    };

    const handleAddId = (id: number) => {
        const exists = assignmentIds.filter((assign) => assign === id);

        if (exists.length > 0) {
            setAssignmentIds(assignmentIds.filter((assign) => assign != id));
        } else {
            setAssignmentIds((prev) => [
                ...prev, id
            ]);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col w-full mb-2">
                <h1 className="font-bold text-4xl text-gray-800 tracking-tight">
                    Planificación Fincas
                </h1>

                {hasPermission('administrate plans production') && (
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setSeeTasks(!seeTasks)}
                        >
                            <Bars3Icon className="w-6 text-gray-700 hover:text-gray-900" />
                        </button>

                        <button
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={() => setSeePersonal(!seePersonal)}
                        >
                            <UserIcon className="w-6 text-gray-700 hover:text-gray-900" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 flex-1">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        editable={true}
                        droppable={true}
                        events={tasksForCalendar?.data}
                        initialDate={tasksForCalendar?.initial_date}
                        dateClick={handleOpenDate}
                        eventClick={(info) => {
                            const task = tasksForCalendar?.data.find(
                                (task) => task.id === info.event.id
                            );
                            if (task) {
                                setSelectedTask(task);
                                setModalInfoTarea(true);
                            }
                        }}
                        dayMaxEventRows={true}
                    />
                </div>

                <div className={`flex flex-col w-2/5 space-y-5 ${!seeTasks ? 'hidden' : ''}`}>
                    <aside className="bg-white rounded-xl border border-gray-200 shadow-lg max-h-screen overflow-y-auto scrollbar-hide">
                        <div className="sticky top-0 bg-white z-10 p-5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">
                                Tareas sin fecha de operación
                            </h2>

                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-700 font-semibold">
                                    Tareas seleccionadas: {ids.length}
                                </p>
                                <Trash
                                    className="w-5 h-5 cursor-pointer hover:text-red-500"
                                    onClick={() => setIds([])}
                                />
                            </div>

                            <button
                                disabled={ids.length === 0}
                                className={`button w-full py-2 rounded-lg transition ${ids.length === 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                                onClick={() => setModal(true)}
                            >
                                Actualizar Tareas
                            </button>

                            <div className="flex flex-col mt-5 gap-4 text-xs">
                                <Select
                                    options={lotesOptions}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="--SELECCIONE UN LOTE--"
                                    onChange={(selected) => selected?.value && setLoteId(selected.value)}
                                />

                                <Select
                                    options={tareasOptions}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="--SELECCIONE UNA TAREA--"
                                    onChange={(selected) => selected?.value && setTaskId(selected.value)}
                                />
                            </div>
                        </div>

                        {isLoading && <Spinner />}

                        <div className="space-y-4 p-5">
                            {tasks?.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center">No existen tareas</p>
                            ) : (
                                tasks?.map((task) => (
                                    <TaskCalendarFincaComponent
                                        key={task.id}
                                        ids={ids}
                                        setIds={setIds}
                                        task={task}
                                    />
                                ))
                            )}
                        </div>
                    </aside>
                </div>

                <div className={`flex flex-col w-3/5 space-y-5 ${!seePersonal ? 'hidden' : ''}`}>
                    <aside className="bg-white rounded-xl border border-gray-200 shadow-lg max-h-screen overflow-y-auto scrollbar-hide pb-6">
                        <div className="sticky top-0 bg-white z-10 p-5 border-b mb-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Asignación de Personal
                                </h2>

                                <div className="flex gap-3">
                                    <button
                                        className={`button px-4 py-2 rounded-lg transition ${view === 1
                                            ? "bg-indigo-700 text-white"
                                            : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                            }`}
                                        onClick={() => setView(1)}
                                    >
                                        Personal
                                    </button>

                                    <button
                                        className={`button px-4 py-2 rounded-lg transition ${view === 2
                                            ? "bg-indigo-700 text-white"
                                            : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                            }`}
                                        onClick={() => setView(2)}
                                    >
                                        Grupos
                                    </button>
                                </div>
                            </div>
                        </div>

                        {view === 1 ? (
                            <div className="space-y-6 p-6">
                                <div className="flex flex-col gap-4 text-xs">

                                    <Select
                                        options={lotesOptions}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="--SELECCIONE UN LOTE--"
                                        onChange={(selected) => selected?.value && setLoteId(selected.value)}
                                    />

                                    <input
                                        type="text"
                                        value={queryEmployee}
                                        placeholder="Buscar empleado..."
                                        className="w-full px-3 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={handleChange}
                                    />

                                    <div className="flex justify-between gap-4">

                                        <button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl shadow flex justify-center gap-2 items-center transition-all"
                                            onClick={() => navigate("?upload=true")}
                                        >
                                            <UploadIcon />
                                            Cargar Asignaciones
                                        </button>

                                        <button
                                            className={`w-full text-white py-2 rounded-xl shadow flex justify-center gap-2 items-center transition-all ${assignmentIds.length == 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                            onClick={() => navigate("?assignGroup=true")}
                                            disabled={assignmentIds.length == 0}
                                        >
                                            Asignar a grupo
                                        </button>

                                    </div>
                                </div>


                                {isLoadingEmployees && <Spinner />}
                                {employees?.length === 0 && (
                                    <p className="text-center text-gray-500">
                                        No existe asignación de empleados
                                    </p>
                                )}

                                <div className="grid xl:grid-cols-4 md:grid-cols-3 gap-6">
                                    {employees?.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className={`rounded-xl p-4 shadow-md border hover:shadow-lg transition ${assignmentIds.includes(employee.id) ? 'bg-indigo-200' : 'bg-white'}`}
                                        >
                                            <div className="flex justify-between">
                                                <XIcon
                                                    className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                                                    onClick={() => deleteEmployee({ id: employee.id })}
                                                />
                                                <PlusIcon
                                                    className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                                                    onClick={() => handleAddId(employee.id)}
                                                />
                                            </div>

                                            <div className="flex justify-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <UserIcon className="w-8 h-8 text-gray-600" />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {employee.code}
                                                </p>
                                                <p className="text-base font-bold text-indigo-500 mt-1">
                                                    {employee.group}
                                                </p>
                                                <p className="text-base font-medium text-gray-800 mt-1">
                                                    {employee.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 p-6">
                                <button
                                    className="button bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex justify-center gap-2 items-center"
                                    onClick={() => navigate("?createGroup=true")}
                                >
                                    <PlusIcon />
                                    Crear Grupo
                                </button>

                                {isLoadingGroups && <Spinner />}
                                {groups?.length === 0 && (
                                    <p className="text-center text-gray-500">
                                        No existe grupos de fincas
                                    </p>
                                )}

                                <div className="grid xl:grid-cols-4 md:grid-cols-3 gap-6">
                                    {groups?.map((group) => (
                                        <div
                                            key={group.id}
                                            className="rounded-xl p-4 bg-white shadow-md border hover:shadow-lg transition"
                                        >
                                            <div className="flex justify-center">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <Archive className="w-8 h-8 text-gray-600" />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {group.code}
                                                </p>
                                                <p className="text-sm text-gray-500">{group.lote}</p>
                                                <p className="text-base font-medium text-gray-800 mt-1">
                                                    {group.finca}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <ModalChangeOperationDateAgricola
                show={modal}
                setModal={setModal}
                ids={ids}
                id={id}
                setIds={setIds}
            />

            <ModalInfoTareaLote
                show={modalInfoTarea}
                setModal={setModalInfoTarea}
                task={selectedTask}
                setSelectedTask={setSelectedTask}
            />

            <ModalInsumosPrepared id={id} />
            <ModalUploadAgricolaAssignments lote_id={loteId} />
            <ModalCreateFincaGroup lotes={lotesOptions} />
            <ModalAssignGroup ids={assignmentIds} loteId={loteId} setAssignmentIds={setAssignmentIds} />
        </div>
    );
}

