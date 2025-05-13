import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { PlusIcon, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SignatureCanvas from "react-signature-canvas";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import ModalAddMaterialEmpaque from "@/components/modals/ModalAddMaterialEmpaque";
import SignatureField from "@/components/form/SignatureComponent";
import { createPackingMaterialReception } from "@/api/ReceptionPackingMaterialsAPI";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftMaterialReception = {
  supervisor_name: string;
  invoice_date: string;
  user_signature: string;
  supervisor_signature: string;
  observations: string;
};

export type DraftItem = {
  name: string;
  p_material_id: string;
  lote: string;
  quantity: number;
};

export default function CrearRecepcionMaterial() {
  const [modal, setModal] = useState<boolean>(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const navigate = useNavigate();
  const user_signature = useRef({} as SignatureCanvas);
  const supervisor_signature = useRef({} as SignatureCanvas);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<DraftMaterialReception>();

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter((item) => item.p_material_id !== id);
    setItems(newItems);
  };
  const { mutate, isPending } = useMutation({
    mutationFn: createPackingMaterialReception,
    onSuccess: () => {
      toast.success("Recepción registrada exitosamente");
      navigate("/recepciones-mp");
    },
    onError: () => {
      toast.error("Hubo un error al registrar la recepción");
    },
  });

  const onSubmit = async (data: DraftMaterialReception) => {
    if (items.length === 0) {
      toast.error("Debe relacionar al menos un item");
      return;
    }

    const payload = {
      ...data,
      items,
    };

    mutate(payload);
  };


  return (
    <>
      <h2 className="text-4xl font-bold">Recepcion de material de empaque</h2>

      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputComponent<DraftMaterialReception>
          label="Nombre del supervisor"
          id="supervisor_name"
          name="supervisor_name"
          placeholder="Ingrese el nombre del supervisor"
          register={register}
          validation={{ required: "El nombre del supervisor es obligatorio" }}
          errors={errors}
          type={"string"}
        >
          {errors.supervisor_name && (
            <Error> {errors.supervisor_name?.message?.toString()} </Error>
          )}
        </InputComponent>

        <InputComponent<DraftMaterialReception>
          label="Fecha de factura"
          id="invoice_date"
          name="invoice_date"
          placeholder="Ingrese la fecha de recepcion"
          register={register}
          validation={{ required: "La fecha de factura es obligatoria" }}
          errors={errors}
          type={"date"}
        >
          {errors.invoice_date && (
            <Error> {errors.invoice_date?.message?.toString()} </Error>
          )}
        </InputComponent>

        <fieldset className="border p-5">
          <legend className="text-2xl font-bold">Items</legend>
          <button
            type="button"
            className="button bg-indigo-500 flex gap-2 hover:bg-indigo-600"
            onClick={() => setModal(!modal)}
          >
            <PlusIcon />
            <p>Producto</p>
          </button>

          {items.length === 0 ? (
            <p className="text-center font-medium">No existen items registrados</p>
          ) : (
            <table className="table mt-5">
              <thead>
                <tr className="thead-tr">
                  <th className="thead-th">Nombre</th>
                  <th className="thead-th">Lote</th>
                  <th className="thead-th">Cantidad</th>
                  <th className="thead-th">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr className="tbody-tr" key={item.p_material_id}>
                    <td className="tbody-td">{item.name}</td>
                    <td className="tbody-td">{item.lote}</td>
                    <td className="tbody-td">{item.quantity}</td>
                    <td className="tbody-td">
                      <Trash
                        className="hover:text-gray-400 cursor-pointer"
                        onClick={() => handleDeleteItem(item.p_material_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </fieldset>

        <fieldset className="flex gap-2 border p-5">
          <legend className="font-bold text-3xl">Firmas</legend>
          <SignatureField name="supervisor_signature" control={control} canvasRef={supervisor_signature} errors={errors} label="Firma de Supervisor" />
          <SignatureField name="user_signature" control={control} canvasRef={user_signature} errors={errors} label="Firma de Receptor" />
        </fieldset>

        <InputComponent<DraftMaterialReception>
          label="Observaciones"
          id="observations"
          name="observations"
          placeholder="Observaciones Generales"
          register={register}
          validation={{}}
          errors={errors}
          type={'text'}
        >
          {errors.observations && <Error>{errors.observations?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>

      <ModalAddMaterialEmpaque modal={modal} setModal={setModal} setItems={setItems} />
    </>
  );
}


