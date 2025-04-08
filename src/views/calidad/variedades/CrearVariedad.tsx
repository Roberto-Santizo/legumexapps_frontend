import { useForm } from "react-hook-form";
import { DraftVariety } from "@/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createVariety } from "@/api/VarietiesAPI";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

export default function CrearVariedad() {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: createVariety,
        onError: () => {
            toast.error('Hubo un error al crear la variedad');
        },
        onSuccess: () => {
            toast.success('Variedad creada correctamente');
            navigate('/productos/variedades');
        }
    });
    const {
        handleSubmit,
        formState: { errors },
        register
    } = useForm<DraftVariety>();

    const onSubmit = async (data: DraftVariety) => mutate(data);

    return (
        <div>
            <h2 className="font-bold text-3xl">Crear Variedad</h2>

            <form className="mt-5 w-1/2 mx-auto" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-bold uppercase" htmlFor="name">
                        Nombre:
                    </label>
                    <input
                        autoComplete="off"
                        id="name"
                        type="text"
                        placeholder={"Nombre de la variedad"}
                        className="border border-black p-3"
                        {...register("name", { required: 'El nombre de la variedad es requerida' })}
                    />
                    {errors.name?.message && <Error>{errors.name.message}</Error>}
                </div>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                    {isPending ? <Spinner /> : <p>Crear Variedad</p>}
                </button>
            </form>
        </div>
    )
}
