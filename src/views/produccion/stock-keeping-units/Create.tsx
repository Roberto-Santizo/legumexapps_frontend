import { useForm } from "react-hook-form";
import { createSKU } from "@/api/SkusAPI";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import ModalAddItemRecipe from "@/components/modals/ModalAddItemRecipe";
import { useNotification } from "../../../core/notifications/NotificationContext";

export type DraftRecipeSku = {
  packing_material_id: string;
  lbs_per_item: string;
  name: string;
}

export type DraftSku = {
  code: string;
  product_name: string;
  presentation: number;
  boxes_pallet: number;
  pallets_container: number;
  hours_container: number;
  client_name: string;
  recipe: DraftRecipeSku[]
}

export default function Create() {
  const [items, setItems] = useState<DraftRecipeSku[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createSKU,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/skus');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftSku>();


  const handleDeleteItem = (id: DraftRecipeSku['packing_material_id']) => {
    setItems((prev) => prev.filter(item => item.packing_material_id !== id));
  }

  const onSubmit = (data: DraftSku) => {
    data.recipe = items;
    mutate(data)
  };

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear SKU</h2>

      <div>
        <form
          className="mt-10 xl:w-2/3 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <InputComponent<DraftSku>
            label="Código del SKU"
            id="code"
            name="code"
            placeholder="Código del SKU"
            register={register}
            validation={{ required: 'El código del SKU es requerido' }}
            errors={errors}
            type={'text'}
          >
            {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Nombre del Producto"
            id="product_name"
            name="product_name"
            placeholder="Nombre del producto del SKU"
            register={register}
            validation={{ required: 'El nombre del producto es obligatorio' }}
            errors={errors}
            type={'text'}
          >
            {errors.product_name && <Error>{errors.product_name?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Presentación"
            id="presentation"
            name="presentation"
            placeholder="Presentación del producto. Ej: 24LBS"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.presentation && <Error>{errors.presentation?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Cajas por Pallet"
            id="boxes_pallet"
            name="boxes_pallet"
            placeholder="Número de cajas que componen un pallet"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.boxes_pallet && <Error>{errors.boxes_pallet?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Pallets por Contenedor"
            id="pallets_container"
            name="pallets_container"
            placeholder="Cantidad de Pallets por Contenedor"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.pallets_container && <Error>{errors.pallets_container?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Horas Por Contenedor"
            id="hours_container"
            name="hours_container"
            placeholder="Horas Por Contenedor"
            register={register}
            validation={{ min: { value: 0, message: 'El valor minimo debe de ser mayor a 0' } }}
            errors={errors}
            type={'number'}
          >
            {errors.hours_container && <Error>{errors.hours_container?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftSku>
            label="Nombre del Cliente"
            id="client_name"
            name="client_name"
            placeholder="Nombre del Cliente"
            register={register}
            validation={{ required: 'El nombre del cliente es obligatorio' }}
            errors={errors}
            type={'text'}
          >
            {errors.client_name && <Error>{errors.client_name?.message?.toString()}</Error>}
          </InputComponent>

          <fieldset className="border p-5">
            <legend className="text-2xl font-bold">Receta</legend>
            <button
              className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2"
              type="button"
              onClick={() => setModal(true)}
            >
              <PlusIcon />
              <span>Agregar Item</span>
            </button>

            {items.length > 0 ? (
              <div className="table-wrapper w-1/2 xl:w-full overflow-x-auto">

                <table className="table mt-5">
                  <thead>
                    <tr className="thead-tr">
                      <th className="thead-th">Item</th>
                      <th className="thead-th">Libras por unidad</th>
                      <th className="thead-th">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr className="tbody-tr" key={index}>
                        <td className="tbody-td">
                          {item.name}
                        </td>
                        <td className="tbody-td">
                          {item.lbs_per_item}
                        </td>
                        <td className="tbody-td flex gap-2">
                          <TrashIcon className="text-gray-500 hover:text-gray-600 cursor-pointer" onClick={() => handleDeleteItem(item.packing_material_id)} />
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center font-medium text-xs xl:text-base mt-5">
                No existen items registrados
              </p>
            )}
          </fieldset>

          <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear SKU</p>}
          </button>
        </form>
      </div>

      <ModalAddItemRecipe modal={modal} setModal={setModal} setItems={setItems} />
    </>
  );
}