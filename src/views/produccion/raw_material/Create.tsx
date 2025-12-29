import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { DraftMateriaPrimaItem } from "@/types/materiaPrimaTypes";
import { createMateriaPrimaItem } from "@/api/MateriaPrimaAPI";
import { useNavigate } from "react-router-dom";
import FormMateriaPrima from "./Form";
import Spinner from "@/components/utilities-components/Spinner";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Create() {
    const navigate = useNavigate();
    const notify = useNotification();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftMateriaPrimaItem>();

    const { mutate, isPending } = useMutation({
        mutationFn: createMateriaPrimaItem,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data);
            navigate('/materia-prima');
        }
    });

    const onSubmit = (formData: DraftMateriaPrimaItem) => mutate({ formData });

    return (
        <>
            <h2 className="text-2xl xl:text-4xl font-bold">Crear Item Materia Prima</h2>
            <form
                className="mt-10 w-full xl:w-3/4 mx-auto shadow-xl p-10 space-y-5 my-5"
                onSubmit={handleSubmit(onSubmit)}
            >

                <FormMateriaPrima register={register} errors={errors} />

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Crear</p>}
                </button>
            </form>
        </>
    )
}
