import { getAllSkus } from "@/api/SkusAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createLineaSku } from "@/api/LineasSkuAPI";
import { useNavigate } from "react-router-dom";
import { getAllLines } from "@/api/LineasAPI";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import InputComponent from "@/components/form/InputComponent";
import InputSelectComponent from "@/components/form/InputSelectComponent";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftLineaSku = {
    sku_id: string;
    line_id: string;
    lbs_performance: number;
    accepted_percentage: number;
    payment_method: number;
}

export default function CrearLineaSku() {
    const navigate = useNavigate();
    const paymentMethodsOptions = [{ value: '0', label: 'Horas Rendimiento' }, { value: '1', label: 'Horas Linea' }];

    const { mutate, isPending } = useMutation({
        mutationFn: createLineaSku,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data);
            navigate('/lineas-skus');
        }
    });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors }
    } = useForm<DraftLineaSku>();

    const results = useQueries({
        queries: [
            { queryKey: ['getAllSkus'], queryFn: getAllSkus },
            { queryKey: ['getAllLines'], queryFn: getAllLines },
        ]
    });

    const onSubmit = (data: DraftLineaSku) => mutate(data);
    if (results) return (
        <div>
            <h2 className="font-bold text-4xl">Relacionar Linea a SKU</h2>

            <form className="mt-10 w-2/3 mx-auto space-y-5 p-10 shadow-xl" onSubmit={handleSubmit(onSubmit)}>

                <InputSelectSearchComponent<DraftLineaSku>
                    label="SKU"
                    id="sku_id"
                    name="sku_id"
                    options={results[0].data || []}
                    control={control}
                    rules={{ required: 'El sku es requerido' }}
                    errors={errors}
                >
                    {errors.sku_id && <Error>{errors.sku_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <InputSelectSearchComponent<DraftLineaSku>
                    label="Linea"
                    id="line_id"
                    name="line_id"
                    options={results[1].data || []}
                    control={control}
                    rules={{ required: 'La linea es obligatoria' }}
                    errors={errors}
                >
                    {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>


                <InputComponent<DraftLineaSku>
                    label="Libras/Hora"
                    id="lbs_performance"
                    name="lbs_performance"
                    placeholder="Rendimiento de lbs por hora"
                    register={register}
                    validation={{}}
                    errors={errors}
                    type={'number'}
                >
                    {errors.lbs_performance && <Error>{errors.lbs_performance?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftLineaSku>
                    label="Porcentaje Aceptado"
                    id="accepted_percentage"
                    name="accepted_percentage"
                    placeholder="Porcentaje Aceptado"
                    register={register}
                    validation={{
                        required: "El porcentaje aceptado es requerido",
                        min: { value: 0, message: 'El valor debe de ser mayor a 0' }
                    }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.accepted_percentage && <Error>{errors.accepted_percentage?.message?.toString()}</Error>}
                </InputComponent>

                <InputSelectComponent<DraftLineaSku>
                    label="Método de Pago"
                    id="payment_method"
                    name="payment_method"
                    options={paymentMethodsOptions}
                    register={register}
                    validation={{ required: 'El método de pago es obligatorio' }}
                    errors={errors}
                >
                    {errors.payment_method && <Error>{errors.payment_method?.message?.toString()}</Error>}
                </InputSelectComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Relacionar Linea</p>}
                </button>
            </form>
        </div>
    )
}
