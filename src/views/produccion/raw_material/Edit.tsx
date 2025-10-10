import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DraftMateriaPrimaItem, MateriaPrimaItem } from "@/types/materiaPrimaTypes";
import { editMateriaPrimaItem, getMateriaPrimaItemById } from "@/api/MateriaPrimaAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import FormMateriaPrima from "./Form";
import Spinner from "@/components/utilities-components/Spinner";

export default function Edit() {
    const params = useParams<{ id: MateriaPrimaItem['id'] }>();
    const id = params.id!!;

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<DraftMateriaPrimaItem>();

    const { data: item } = useQuery({
        queryKey: ['getMateriaPrimaItemById', id],
        queryFn: () => getMateriaPrimaItemById({ id })
    });

    useEffect(() => {
        if (item) {
            setValue('code', item.code);
            setValue('product_name', item.product_name);
            setValue('type', item.type);
        }
    }, [item]);

    const { mutate, isPending } = useMutation({
        mutationFn: editMateriaPrimaItem,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate('/materia-prima');
        }
    });

    const onSubmit = (formData: DraftMateriaPrimaItem) => mutate({ id, formData });

    if (item) return (
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
