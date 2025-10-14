import { useForm } from "react-hook-form";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPackingMaterialTransaction } from "@/api/PackingMaterialTransactionsAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { DraftPackingMaterialTransactionItem, DraftTransactionPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import FormPackingMaterialTransaction from "./Form";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "@/components/form/SignatureComponent";
import Spinner from "@/components/utilities-components/Spinner";
import ModalAddItemPackingMaterialDispatch from "@/components/modals/ModalAddItemPackingMaterialDispatch";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function CreateBodegaSalidaEmpaque() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('taskId')!;

  const url = location.state?.url;

  const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [indexItem, setIndexItem] = useState<number | null>(null);
  const responsable_signature = useRef({} as SignatureCanvas);
  const user_signature = useRef({} as SignatureCanvas);
  const navigate = useNavigate();
  const notify = useNotification();


  const { mutate, isPending } = useMutation({
    mutationFn: createPackingMaterialTransaction,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data);
      if (url) {
        navigate(url, { replace: true });
      } else {
        navigate('/material-empaque-transacciones');
      }
    }
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    setValue
  } = useForm<DraftTransactionPackingMaterial>();

  useEffect(() => {
    if (taskId) {
      setValue('task_production_plan_id', taskId);
    }
  }, [taskId]);

  const handleDeleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleEditItem = (index: number) => {
    setIndexItem(index + 1);
    setModal(true);
  };

  const onSubmit = (data: DraftTransactionPackingMaterial) => {
    if (items.length === 0) {
      notify.error('Debe seleccionar al menos 1 item');
      return;
    }

    data.items = items;
    data.wastages = [];
    mutate(data);
  }

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Registrar salida de bodega</h2>
      <form className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormPackingMaterialTransaction register={register} errors={errors} control={control} />

        <fieldset className="border p-5">
          <legend className="text-2xl font-bold">Items</legend>
          <button
            className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2"
            type="button"
            onClick={() => setModal(true)}
          >
            <PlusIcon />
            <span>Agregar Item</span>
          </button>

          {items.length > 0 ? (
            <div className="table-wrapper w-48 xl:w-full">
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
            </div>
          ) : (
            <p className="text-center font-medium text-xs xl:text-base mt-5">
              No existen items registrados
            </p>
          )}
        </fieldset>

        <fieldset className="flex gap-2 border p-5 flex-col xl:flex-row">
          <legend className="font-bold text-3xl">Firmas</legend>
          <SignatureField
            name="responsable_signature"
            control={control}
            canvasRef={responsable_signature}
            errors={errors}
            label="Firma"
          />
          <SignatureField
            name="user_signature"
            control={control}
            canvasRef={user_signature}
            errors={errors}
            label="Firma encargado de bodega"
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
