import { SetStateAction, useRef } from "react";
import { getCurrentDate } from "@/helpers";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeOperationDate } from "@/api/TasksWeeklyPlanAPI";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

type Props = {
    show: boolean;
    setModal: React.Dispatch<SetStateAction<boolean>>;
    id: string;
    ids: string[];
    setIds: React.Dispatch<SetStateAction<string[]>>;
}

export default function ModalChangeOperationDateAgricola({ show, setModal, ids, id, setIds }: Props) {
    const operationDateRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: changeOperationDate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
            setIds([]);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (operationDateRef.current && operationDateRef.current.value) {
            mutate({date: operationDateRef.current.value, ids: ids});
        } else {
            toast.error('Seleccione una fecha de operación válida');
        }
    }
    return (
        <Modal modal={show} closeModal={() => setModal(false)} title="Cambio de Fecha de Operación">
            <form className="p-10 space-y-6" noValidate onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="operation_date" className="font-bold uppercase">Fecha de Operación</label>
                    <input ref={operationDateRef} type="date" name="operation_date" className="border p-2 border-black" min={getCurrentDate()} />

                    <button disabled={isPending || ids.length === 0} className={`button ${ids.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}  w-full`}>
                        {isPending ? <Spinner /> : <p>Guardar Fecha de Operación</p>}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
