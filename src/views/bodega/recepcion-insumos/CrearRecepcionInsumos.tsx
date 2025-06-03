import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { createReceptionInsumos } from "@/api/RecepcionInsumosAPI";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import FormRecepcionInsumos from "./FormRecepcionInsumos";
import ModalAddItemRecepcionInsumos from "@/components/modals/ModalAddItemRecepcionInsumos";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "@/components/form/SignatureComponent";

export type DraftRecepcionInsumos = {
  supplier_id: string;
  supervisor_name: string;
  invoice: string;
  invoice_date: string;
  user_signature: string;
  supervisor_signature: string;
  items: DraftItemRecepcionInsumos[];
};

export type DraftItemRecepcionInsumos = {
  insumo_id: string;
  name: string;
  units: number;
}


export default function CrearInsumo() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);
  const [items, setItems] = useState<DraftItemRecepcionInsumos[]>([]);
  const supervisor_signature = useRef({} as SignatureCanvas);
  const user_signature = useRef({} as SignatureCanvas);

  const { mutate, isPending } = useMutation({
    mutationFn: createReceptionInsumos,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/recepciones-insumos');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<DraftRecepcionInsumos>();


  const handleDeleteItem = (id: DraftItemRecepcionInsumos['insumo_id']) => {
    setItems((prev) => prev.filter(item => item.insumo_id !== id));
  }
  const onSubmit = (data: DraftRecepcionInsumos) => {
    if (items.length === 0) {
      toast.error('Debe de elegir por lo menos 1 item');
      return;
    }
    data.items = items;

    mutate(data);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Registrar insumos</h2>
      <form
        className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormRecepcionInsumos register={register} errors={errors} control={control} />

        <fieldset className="border p-5">
          <legend className="text-2xl font-bold">Insumos</legend>
          <button className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2" type="button" onClick={() => setModal(true)}>
            <PlusIcon />
            <span>Registrar Linea</span>
          </button>

          {items.length > 0 ? (
            <table className="table mt-5">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Insumo</th>
                  <th className="thead-th">Unidades</th>
                  <th className="thead-th">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.insumo_id} className="tbody-tr">
                    <td className="tbody-td">{item.name}</td>
                    <td className="tbody-td">{item.units}</td>
                    <td className="tbody-td">
                      <TrashIcon
                        onClick={() => handleDeleteItem(item.insumo_id)}
                        className="text-gray-500 hover:text-gray-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center font-medium">No existen insumos registrados</p>
          )}

        </fieldset>

        <fieldset className="flex gap-2 border p-5">
          <legend className="font-bold text-3xl">Firmas</legend>
          <SignatureField name="supervisor_signature" control={control} canvasRef={supervisor_signature} errors={errors} label="Firma de Supervisor" />
          <SignatureField name="user_signature" control={control} canvasRef={user_signature} errors={errors} label="Firma de Receptor" />
        </fieldset>


        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>

      <ModalAddItemRecepcionInsumos modal={modal} setModal={setModal} setItems={setItems} items={items} />
    </>
  );
}

