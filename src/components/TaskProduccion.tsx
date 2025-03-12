export default function TaskProduccion() {
    return (
        <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
            {/* <div className="col-span-5">
                <TaskLabel label={"Linea"} text={task.line} />
                <TaskLabel label={"Total de tarimas"} text={task.total_tarimas.toString()} />
                <TaskLabel label={"Horas Teoricas"} text={task.hours.toString()} />
                <TaskLabel label={"Dia de operacion"} text={formatDate(task.operation_date)} />
                <TaskLabel label={"Fecha de inicio"} text={task.start_date ?? 'SIN FECHA DE INICIO'} />
                <TaskLabel label={"Fecha de cierre"} text={task.end_date ?? 'SIN FECHA FINAL'} />
                <TaskLabel label={"Horas totales"} text={task.total_hours.toString()} />
            </div>

            <div className="col-start-7 space-y-5">
                <div className="flex flex-col justify-center items-center gap-4">
                    <PlayCircleIcon className="cursor-pointer text-green-500 hover:text-green-400" />
                    <CircleCheck className="cursor-pointer hover:text-green-400" />
                    <CirclePause className="cursor-pointer text-orange-500 hover:text-orange-800" />
                </div>
            </div> */}
        </div>
    )
}
