import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editSkuRecipeItem, getSkuRecipeItemById, SKU } from "@/api/SkusAPI";
import { useForm } from "react-hook-form";
import { DraftRawMaterialSkuItemRecipe } from "types/skuTypes";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";

export default function ModalRawMaterialRecipe() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const rawMaterialId = queryParams.get('rawMaterialId')!;
    const show = (rawMaterialId) ? true : false;
    const navigate = useNavigate();
    const params = useParams<{ id: SKU['id'] }>();
    const id = params.id!;

    const querClient = useQueryClient();

    const handleCloseModal = () => {
        navigate(location.pathname)
    }

    const { data } = useQuery({
        queryKey: ['getSkuRecipeItemById', rawMaterialId],
        queryFn: () => getSkuRecipeItemById({ id: rawMaterialId }),
        enabled: !!rawMaterialId
    });

    const { mutate } = useMutation({
        mutationFn: editSkuRecipeItem,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            handleCloseModal();
            querClient.invalidateQueries({ queryKey: ['getSkuById', id] });
        }
    });

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<DraftRawMaterialSkuItemRecipe>();

    useEffect(() => {
        if (data) {
            setValue('percentage', data.percentage);
            setValue('raw_material_item_id', data.raw_material_item_id.toString());
            setValue('stock_keeping_unit_id', data.stock_keeping_unit_id.toString());
        }
    }, [data]);

    const onSubmit = (formData: DraftRawMaterialSkuItemRecipe) => mutate({ id: rawMaterialId, formData });

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Editar Item">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputComponent<DraftRawMaterialSkuItemRecipe>
                    label="Porcentaje"
                    id="percentage"
                    name="percentage"
                    placeholder="Porcentaje de composición por persentación"
                    register={register}
                    validation={{}}
                    errors={errors}
                    type={'number'}
                >
                    {errors.percentage && <Error>{errors.percentage?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={false} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {false ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    )
}
