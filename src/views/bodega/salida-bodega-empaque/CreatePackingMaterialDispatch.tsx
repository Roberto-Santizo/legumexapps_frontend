import { useForm } from "react-hook-form";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { createPackingMaterialDispatch } from "@/api/PackingMaterialDispatches";
import { DraftDispatchPackingMaterial, DraftItemDispatchPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import { useNavigate } from "react-router-dom";
import FormPackingMaterialDispatch from "./FormPackingMaterialDispatch";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "@/components/form/SignatureComponent";
import Spinner from "@/components/utilities-components/Spinner";
import ModalAddItemPackingMaterialDispatch from "@/components/modals/ModalAddItemPackingMaterialDispatch";

export default function CreateBodegaSalidaEmpaque() {
  const [items, setItems] = useState<DraftItemDispatchPackingMaterial[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [indexItem, setIndexItem] = useState<number | null>(null);
  const responsable_signature = useRef({} as SignatureCanvas);
  const user_signature = useRef({} as SignatureCanvas);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createPackingMaterialDispatch,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/salidas-mp');
    }
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<DraftDispatchPackingMaterial>();

  const handleDeleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleEditItem = (index: number) => {
    setIndexItem(index + 1);
    setModal(true);
  };

  const onSubmit = (data: DraftDispatchPackingMaterial) => {
    if (items.length === 0) {
      toast.error('Debe seleccionar al menos 1 item');
      return;
    }

    data.items = items;
    mutate(data);
  }

  return (
    <>
      <h2 className="text-4xl font-bold">Registrar salida de bodega</h2>
      <form className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormPackingMaterialDispatch register={register} errors={errors} />

        <fieldset className="border p-5">
          <legend className="text-2xl font-bold">Materiales</legend>
          <button
            className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2"
            type="button"
            onClick={() => setModal(true)}
          >
            <PlusIcon />
            <span>Registrar Material</span>
          </button>

          {items.length > 0 ? (
            <table className="table mt-5">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Item</th>
                  <th className="thead-th">Cantidad</th>
                  <th className="thead-th">Uso/Destino</th>
                  <th className="thead-th">Lote</th>
                  <th className="thead-th"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr className="tbody-tr" key={index}>
                    <td className="tbody-td">{item.name}</td>
                    <td className="tbody-td">{item.quantity}</td>
                    <td className="tbody-td">{item.destination}</td>
                    <td className="tbody-td">{item.lote}</td>
                    <td className="tbody-td flex gap-2">
                      <TrashIcon className="text-gray-500 hover:text-gray-600 cursor-pointer" onClick={() => handleDeleteItem(index)} />
                      <EditIcon className="text-gray-500 hover:text-gray-600 cursor-pointer" onClick={() => handleEditItem(index)} />
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          ) : (
            <p className="text-center font-medium">
              No existen items registrados
            </p>
          )}
        </fieldset>

        <fieldset className="flex gap-2 border p-5">
          <legend className="font-bold text-3xl">Firmas</legend>
          <SignatureField
            name="responsable_signature"
            control={control}
            canvasRef={responsable_signature}
            errors={errors}
            label="Firma del responsable cajas"
          />
          <SignatureField
            name="user_signature"
            control={control}
            canvasRef={user_signature}
            errors={errors}
            label="Firma usuario"
          />
        </fieldset>
        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>

      <ModalAddItemPackingMaterialDispatch
        modal={modal}
        setModal={setModal}
        setItems={setItems}
        selectedIndex={indexItem}
        setIndexItem={setIndexItem}
        items={items}
      />
    </>
  );
};
