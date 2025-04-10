import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTimeoutById, updateTimeOut } from "@/api/TimeOutsAPI";
import { useForm } from "react-hook-form";
import { DraftTiempoMuerto } from "./CrearTiempoMuerto";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import FormTiempoMuerto from "./FormTiempoMuerto";

export default function EditarTiempoMuerto() {
    const params = useParams();
    const id = params.id!!;

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: updateTimeOut,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Tiempo muerto actualizado correctamente');
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
            setValue('hours', task.hours.toString());
        }
    }, [task]);

    const onSubmit = (formData: DraftTiempoMuerto) => {
        const data = {
            id: id,
            data: formData
        }
        mutate(data);
    }

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (task) return (
        <div>
            <h2 className="font-bold text-4xl">Editar Tiempo Muerto</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10 w-2/3 shadow-xl p-10 mx-auto space-y-5" noValidate>
                <FormTiempoMuerto register={register} errors={errors} />

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                  {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </div>
    )
}
