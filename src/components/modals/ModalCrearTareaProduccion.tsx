import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getLinesBySkuId } from "@/api/LineasAPI";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCurrentDate } from "@/helpers";
import { getSkus } from "@/api/SkusAPI";
import { createNewTaskProduction } from "@/api/TaskProductionPlansAPI";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";

export type DraftNewTaskProduction = {
    sku_id: string,
    line_id: string,
    operation_date: string,
    total_lbs: number,
    destination: string;
}

type Props = {
    date: string;
}

export default function ModalCrearTareaProduccion({date} : Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newTask = queryParams.get('newTask')!;
    const show = newTask ? true : false;
    const params = useParams();
    const plan_id = params.plan_id!!;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [skuId, setSkuId] = useState<string>('');

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', skuId],
        queryFn: () => getLinesBySkuId(skuId),
        enabled: !!skuId
    });

    const { data: skus } = useQuery({
        queryKey: ['getSkus'],
        queryFn: () => getSkus({ page: 1, paginated: '' })
    });

    const skuOptions = skus?.data?.map((sku) => ({
        value: sku.id,
        label: `${sku.code} - ${sku.product_name}`,
    }));

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset
    } = useForm<DraftNewTaskProduction>();

    const { mutate, isPending } = useMutation({
        mutationFn: createNewTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
            navigate(location.pathname);
            reset();
        }
    });

    const onSubmit = (data: DraftNewTaskProduction) => {
        mutate(data);
    };

    return (
        <Modal modal={show} closeModal={() => navigate(location.pathname)} title="Creación de Tarea Produccion Extraordinaria">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectSearchComponent<DraftNewTaskProduction>
                    label="SKU"
                    id="sku_id"
                    name="sku_id"
                    options={skuOptions ?? []}
                    control={control}
                    rules={{ required: 'Seleccione un SKU' }}
                    errors={errors}
                    onChange={(value) => setSkuId(value ?? '')}
                >
                    {errors.sku_id && <Error>{errors.sku_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>


                <InputSelectSearchComponent<DraftNewTaskProduction>
                    label="Linea"
                    id="line_id"
                    name="line_id"
                    options={lineas || []}
                    control={control}
                    rules={{ required: 'Seleccione una linea' }}
                    errors={errors}
                >
                    {errors.line_id && <Error>{errors.line_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Total de Libras"
                    id="total_lbs"
                    name="total_lbs"
                    placeholder="Total de Libras"
                    register={register}
                    validation={{ required: 'Las libras totales son obligatorias' }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_lbs && <Error>{errors.total_lbs?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Destino"
                    id="destination"
                    name="destination"
                    placeholder="Nombre del Destino"
                    register={register}
                    validation={{ required: 'El destino es requerido' }}
                    errors={errors}
                    type={'text'}
                >
                    {errors.destination && <Error>{errors.destination?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftNewTaskProduction>
                    label="Fecha de Operación"
                    id="operation_date"
                    name="operation_date"
                    placeholder=""
                    register={register}
                    validation={{ required: 'La fecha de operación es obligatoria' }}
                    errors={errors}
                    type={'date'}
                    min={getCurrentDate()}
                >
                    {errors.operation_date && <Error>{errors.operation_date?.message?.toString()}</Error>}
                </InputComponent>

                <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Crear Tarea Producción</p>}
                </button>
            </form>
        </Modal>
    )
}
