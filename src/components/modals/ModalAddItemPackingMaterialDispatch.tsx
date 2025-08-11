import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getPackingMaterials } from "@/api/PackingMaterialItemsAPI";
import { FiltersPackingMaterialsInitialValues } from "@/views/bodega/packing-material-item/Index";
import { Dispatch, SetStateAction, useEffect } from "react";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import InputComponent from "../form/InputComponent";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import Spinner from "../utilities-components/Spinner";
import { DraftPackingMaterialTransactionItem } from "./ModalEntregaMaterialEmpaque";

type Props = {
  modal: boolean;
  setModal: (open: boolean) => void;
  setItems: Dispatch<SetStateAction<DraftPackingMaterialTransactionItem[]>>;
  setIndexItem: Dispatch<SetStateAction<number | null>>;
  selectedIndex: number | null;
  items: DraftPackingMaterialTransactionItem[];
};

export default function ModalAddItemPackingMaterialDispatch({ modal, setModal, setItems, selectedIndex, setIndexItem, items }: Props) {
  const { data: packingMaterials, isLoading } = useQuery({
    queryKey: ['getPackingMaterials'],
    queryFn: () => getPackingMaterials({ currentPage: 1, filters: FiltersPackingMaterialsInitialValues, paginated: '' })
  });

  const packingMaterialOptions = packingMaterials?.data.map((item) => ({
    value: item.id,
    label: `${item.name}`,
  }));

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<DraftPackingMaterialTransactionItem>();

  useEffect(() => {
    if (selectedIndex) {
      const item = items[selectedIndex - 1];
      setValue('destination', item.destination);
      setValue('lote', item.lote);
      setValue('packing_material_id', item.packing_material_id);
      setValue('quantity', item.quantity);
    }
  }, [selectedIndex]);

  const handleCloseModal = () => {
    setModal(false);
    setIndexItem(null);
    reset();
  }

  const onSubmit = (data: DraftPackingMaterialTransactionItem) => {
    if (selectedIndex) {
      setItems((prev) => {
        return prev.map((item, index) => {
          if (index === selectedIndex - 1) {
            const name = packingMaterials?.data?.find((item) => item.id === data.packing_material_id)?.name;
            data.name = name ?? '';
            return data;
          }
          return item;
        });
      });
    } else {
      const name = packingMaterials?.data?.find((item) => item.id === data.packing_material_id)?.name;
      data.name = name ?? '';
      setItems((prev) => [...prev, data]);
    }

    handleCloseModal();
  };

  return (
    <div>
      <Modal
        modal={modal}
        closeModal={() => handleCloseModal()}
        title="Boleta Salida de Material de Empaque"
      >
        {isLoading && <Spinner />}

        <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-5">
          <InputSelectSearchComponent<DraftPackingMaterialTransactionItem>
            label="Item"
            id="packing_material_id"
            name="packing_material_id"
            options={packingMaterialOptions ?? []}
            control={control}
            rules={{ required: 'El item es requerido' }}
            errors={errors}
          >
            {errors.packing_material_id && <Error>{errors.packing_material_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputComponent<DraftPackingMaterialTransactionItem>
            label="Cantidad"
            id="quantity"
            name="quantity"
            placeholder="La cantidad es requerida"
            register={register}
            validation={{
              required: "La cantidad es requerida",
            }}
            errors={errors}
            type={"NUMBER"}
          >
            {errors.quantity && (
              <Error>{errors.quantity?.message?.toString()}</Error>
            )}
          </InputComponent>

          <InputComponent<DraftPackingMaterialTransactionItem>
            label="Destino/Uso"
            id="destination"
            name="destination"
            placeholder="La cantidad es requerida"
            register={register}
            validation={{
              required: "La descripción del destino es requerida",
            }}
            errors={errors}
            type={"text"}
          >
            {errors.destination && (
              <Error>{errors.destination?.message?.toString()}</Error>
            )}
          </InputComponent>

          <InputComponent<DraftPackingMaterialTransactionItem>
            label="Lote"
            id="lote"
            name="lote"
            placeholder="Ingrese el lote"
            register={register}
            validation={{ required: "El lote es obligatorio" }}
            errors={errors}
            type={"text"}
          >
            {errors.lote && <Error>{errors.lote?.message?.toString()}</Error>}
          </InputComponent>

          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            <p>Agregar</p>
          </button>
        </form>
      </Modal>
    </div>
  );
}
