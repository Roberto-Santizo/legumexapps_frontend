import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createVariety, DraftVariety } from "@/api/VarietiesAPI";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";

export default function Create() {
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: createVariety,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
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

            <form className="mt-5 w-2/3 shadow-xl p-5 mx-auto" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputComponent<DraftVariety>
                    label="Nombre de la variedad"
                    id="name"
                    name="name"
                    placeholder="Nombre de la variedad"
                    register={register}
                    validation={{ requried: 'El nombre de la variedad es requerida' }}
                    errors={errors}
                    type={'text'}
                >
                    {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                    {isPending ? <Spinner /> : <p>Crear Variedad</p>}
                </button>
            </form>
        </div>
    )
}
