import { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPackingMaterials } from "@/api/PackingMaterialItemsAPI";
import { FiltersPackingMaterialsInitialValues } from "@/views/bodega/packing-material-item/Index";
import { DraftRecipeSku } from "@/views/produccion/stock-keeping-units/Create";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import InputComponent from "../form/InputComponent";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setItems: Dispatch<SetStateAction<DraftRecipeSku[]>>;
};
export default function ModalAddItemRecipe({ modal, setModal, setItems }: Props) {
    const { data } = useQuery({
        queryKey: ["getPackingMaterials"],
        queryFn: () => getPackingMaterials({ currentPage: 1, paginated: '', filters: FiltersPackingMaterialsInitialValues }),
    });

    const materialOptions = data?.data?.map((material) => ({
        value: material.id,
        label: material.name,
    }));

    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: { errors },
    } = useForm<DraftRecipeSku>();

    const onSubmit = (formData: DraftRecipeSku) => {
        const name = data?.data?.find((item) => item.id === formData.packing_material_id)?.name;
        formData.name = name ? name : "";

        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) =>
                    item.packing_material_id === formData.packing_material_id
            );

            if (existingIndex !== -1) {
                const updatedItems = [...prev];
                updatedItems[existingIndex].lbs_per_item = formData.lbs_per_item;
                return updatedItems;
            }

            return [...prev, formData];
        });

        setModal(false);
        reset();
    };



    if (materialOptions)
        return (
            <Modal
                modal={modal}
                closeModal={() => setModal(false)}
                title="Agregar materíal"
            >
                <form
                    noValidate
                    className="space-y-5 mx-auto p-10"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <InputSelectSearchComponent<DraftRecipeSku>
                        label="Item"
                        id="packing_material_id"
                        name="packing_material_id"
                        options={materialOptions}
                        control={control}
                        rules={{ required: "El item es obligatorio" }}
                        errors={errors}
                    >
                        {errors.packing_material_id && (
                            <Error>{errors.packing_material_id?.message?.toString()}</Error>
                        )}
                    </InputSelectSearchComponent>

                    <InputComponent<DraftRecipeSku>
                        label="Libras por unidad"
                        id="lbs_per_item"
                        name="lbs_per_item"
                        placeholder="Libras por unidad Ej:1lbs"
                        register={register}
                        validation={{ required: 'Las libras por unidad es requreida' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.lbs_per_item && <Error>{errors.lbs_per_item?.message?.toString()}</Error>}
                    </InputComponent>

                    <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        <p>Agregar Material</p>
                    </button>
                </form>
            </Modal>
        );
}