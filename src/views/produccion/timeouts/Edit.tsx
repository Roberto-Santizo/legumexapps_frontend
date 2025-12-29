import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTimeoutById, updateTimeOut } from "@/api/TimeOutsAPI";
import { useForm } from "react-hook-form";
import { DraftTiempoMuerto } from "./Create";
import { useEffect } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FormTiempoMuerto from "./Form";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Edit() {
    const params = useParams();
    const id = params.id!;
    const notify = useNotification();

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: updateTimeOut,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data ?? '');
            navigate('/tiempos-muertos');
        }
    });
    const { data: task, isLoading, isError } = useQuery({
        queryKey: ['getTimeoutById', id],
        queryFn: () => getTimeoutById(id)
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue
    } = useForm<DraftTiempoMuerto>();

    useEffect(() => {
        if (task) {
            setValue('name', task.name);
        }
    }, [task]);

    const onSubmit = (formData: DraftTiempoMuerto) => {
        const data = {
            id: id,
            FormData: formData
        }
        mutate(data);
    }

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (task) return (
        <div>
            <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Editar Tiempo Muerto</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 xl:w-2/3 shadow-xl p-10 mx-auto space-y-5" noValidate>
                <FormTiempoMuerto register={register} errors={errors} />

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </div>
    )
}
