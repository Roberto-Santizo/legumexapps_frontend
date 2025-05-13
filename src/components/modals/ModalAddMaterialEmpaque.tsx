 import { Dispatch, SetStateAction } from "react";
import { DraftItem } from "@/views/bodega/recepcion-material-empaque/CrearRecepcionMaterial";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPackingMaterials } from "@/api/MaterialEmpaqueAPI";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import InputComponent from "../form/InputComponent";

type Props = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<DraftItem[]>>;
};
export default function ModalAddMaterialEmpaque({
  modal,
  setModal,
  setItems,
}: Props) {
  const { data } = useQuery({
    queryKey: ["getPackingMaterials"],
    queryFn: getPackingMaterials,
  });

  const materialOptions = data?.map((material) => ({
    value: material.id,
    label: material.name,
  }));

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<DraftItem>();

const onSubmit = (formData: DraftItem) => {
  const name = data?.find((item) => item.id === formData.p_material_id)?.name;
  formData.name = name ? name : "";
  formData.quantity = Number(formData.quantity); // Asegurar que sea un número

  setItems((prev) => {
    const existingIndex = prev.findIndex(
      (item) =>
        item.p_material_id === formData.p_material_id &&
        item.lote === formData.lote
    );

    if (existingIndex !== -1) {
      const updatedItems = [...prev];
      updatedItems[existingIndex].quantity += formData.quantity;
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
          <InputSelectSearchComponent<DraftItem>
            label="Item"
            id="p_material_id"
            name="p_material_id"
            options={materialOptions}
            control={control}
            rules={{ required: "El item es obligatorio" }}
            errors={errors}
          >
            {errors.p_material_id && (
              <Error>{errors.p_material_id?.message?.toString()}</Error>
            )}
          </InputSelectSearchComponent>

          <InputComponent<DraftItem>
            label="Lote"
            id="lote"
            name="lote"
            placeholder="Lote"
            register={register}
            validation={{ required: "El lote es requerido" }}
            errors={errors}
            type={"sting"}
          >
            {errors.lote && <Error>{errors.lote?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftItem>
            label="Cantidad"
            id="quantity"
            name="quantity"
            placeholder="Cantidad del item"
            register={register}
            validation={{
              required: "La cantidad es requerida",
              min: { value: 0, message: "El valor minimo es 0" },
            }}
            errors={errors}
            type={"number"}
          >
            {errors.quantity && (
              <Error>{errors.quantity?.message?.toString()}</Error>
            )}
          </InputComponent>

          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            <p>Agregar Material</p>
          </button>
        </form>
      </Modal>
    );
}