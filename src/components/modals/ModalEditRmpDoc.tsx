import { getBoletaInfoAll, updateRmpDocInfo } from "@/api/ReceptionsDocAPI";
import { UpdateRmpDocData } from "@/types/rmpDocTypes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Error from "../utilities-components/Error";
import InputComponent from "../form/InputComponent";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { getAllProductorCDPS } from "@/api/ProductorPlantationAPI";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import { useNotification } from "@/core/notifications/NotificationContext";


export default function ModalEditRmpDoc() {
    const params = useParams();
    const queryParams = new URLSearchParams(location.search);
    const flag = queryParams.get('editDoc')!;
    const show = flag ? true : false;
    const navigate = useNavigate();
    const rm_reception_id = params.rm_reception_id!;
    const notification = useNotification();
    const queryClient = useQueryClient();

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        control
    } = useForm<UpdateRmpDocData>();

    const { data: cdps } = useQuery({
        queryKey: ["getAllProductorCDPS"], queryFn: () => getAllProductorCDPS({ page: 1, paginated: '' }),
    });

    const cdpsOptions = cdps?.data.map((cdp) => ({
        value: cdp.id,
        label: `${cdp.name}`,
    }));

    const { data: boleta } = useQuery({
        queryKey: ['getBoletaInfoAll', rm_reception_id],
        queryFn: () => getBoletaInfoAll(rm_reception_id)
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateRmpDocData) => updateRmpDocInfo({ id: rm_reception_id, payload: data }),
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getBoletaInfoAll', rm_reception_id] });
            handleCloseModal();
        },
        onError: (err) => {
            notification.error(err.message);
        }
    });

    useEffect(() => {
        if (boleta) {
            setValue('weight', boleta.field_data.gross_weight);
            setValue('quality_percentage', boleta.field_data.percentage_field);
            setValue('total_baskets', boleta.field_data.total_baskets);
            setValue('cdp_id', boleta.field_data.cdp_id.toString());
            setValue('plate_id', boleta.field_data.plate_id.toString());
            setValue('grn', boleta.grn ?? null);
        }
    }, [boleta]);

    const onSubmit = (data: UpdateRmpDocData) => mutate(data);

    if (boleta && cdpsOptions) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Editar Documento" >
            <div className="p-5">
                <form className="md:w-full mx-auto space-y-5 shadow-xl p-10" onSubmit={handleSubmit(onSubmit)}>
                    <InputComponent<UpdateRmpDocData>
                        label="Peso Bruto"
                        id="weight"
                        name="weight"
                        placeholder="Peso Bruto"
                        register={register}
                        validation={{ required: 'El peso bruto es obligatorio' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.weight && <Error>{errors.weight?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<UpdateRmpDocData>
                        label="Porcentaje de Calidad de Campo"
                        id="quality_percentage"
                        name="quality_percentage"
                        placeholder="Porcentaje de calidad de campo"
                        register={register}
                        validation={{ required: 'El porcentaje de calidad es obligatorio' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.quality_percentage && <Error>{errors.quality_percentage?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<UpdateRmpDocData>
                        label="Total de Canastas"
                        id="total_baskets"
                        name="total_baskets"
                        placeholder="Total de canastas de campo"
                        register={register}
                        validation={{ required: 'El total de canastas es obligatorio' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.total_baskets && <Error>{errors.total_baskets?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputSelectSearchComponent<UpdateRmpDocData>
                        label="CDP"
                        id="cdp_id"
                        name="cdp_id"
                        options={cdpsOptions}
                        control={control}
                        rules={{ required: 'Seleccione un cdp' }}
                        errors={errors}
                    >
                        {errors.cdp_id && <Error>{errors.cdp_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    {boleta.grn && (
                        <InputComponent<UpdateRmpDocData>
                            label="GRN"
                            id="grn"
                            name="grn"
                            placeholder="GRN"
                            register={register}
                            validation={{}}
                            errors={errors}
                            type={'text'}
                        >
                            {errors.grn && <Error>{errors.grn?.message?.toString()}</Error>}
                        </InputComponent>
                    )}

                    <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {isPending ? <Spinner /> : <p>Guardar</p>}
                    </button>
                </form>
            </div>
        </Modal >
    )
}
