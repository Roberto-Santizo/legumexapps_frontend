import { useForm } from "react-hook-form";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import FormSalidaBodega from "./FormSalidaBodega";
import ModalSalidaBodegaEmpaque from "@/components/modals/ModalSalidaBodegaEmpaque";
import SignatureCanvas from "react-signature-canvas";
import SignatureField from "@/components/form/SignatureComponent";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftBodegaSalida = {
  id: string;
  reference: string;
  responsable_bags: string;
  responsable_boxes: string;
  signature_responsable_boxes: string;
  signature_responsable_bags: string;
  observations: string;
  user_signature: string;
};

export type DraftSalidaDetails = {
  id: string;
  quantity: number;
  lote: string;
};

const CreateBodegaSalidaEmpaque = () => {
  const [items] = useState<DraftBodegaSalida[]>([]);
  {
    /*Agregar el setItem cuando ya se implemente la logica*/
  }
  const [modal, setModal] = useState<boolean>(false);
  const supervisor_signature = useRef({} as SignatureCanvas);
  const user_signature = useRef({} as SignatureCanvas);

  const {
    register,
    formState: { errors },
    control,
  } = useForm<DraftBodegaSalida>();

  // Separate form for DraftSalidaDetails (for ModalSalidaBodegaEmpaque)
  const {
    register: registerDetails,
    formState: { errors: errorsDetails },
  } = useForm<DraftSalidaDetails>();

  return (
    <>
      <h2 className="text-4xl font-bold">Registrar salida de bodega</h2>
      <form className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5">
        <FormSalidaBodega register={register} errors={errors} />

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
                  <th className="thead-th">Insumo</th>
                  <th className="thead-th">Unidades</th>
                  <th className="thead-th">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="tbody-tr">
                  <td className="tbody-td">Insertar dato aca</td>
                  <td className="tbody-td">Insertar dato aca </td>
                  <td className="tbody-td">
                    <TrashIcon className="text-gray-500 hover:text-gray-600 cursor-pointer" />
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center font-medium">
              No existen materiales registrados
            </p>
          )}
        </fieldset>

        <fieldset className="flex gap-2 border p-5">
          <legend className="font-bold text-3xl">Firmas</legend>
          <SignatureField
            name="signature_responsable_boxes"
            control={control}
            canvasRef={supervisor_signature}
            errors={errors}
            label="Firma del responsable cajas"
          />
          <SignatureField
            name="signature_responsable_bags"
            control={control}
            canvasRef={user_signature}
            errors={errors}
            label="Firma responsable bolsas"
          />
          <SignatureField
            name="user_signature"
            control={control}
            canvasRef={user_signature}
            errors={errors}
            label="Firma usuario"
          />
        </fieldset>
        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          <Spinner /> <p>Crear</p>
        </button>
      </form>

      <ModalSalidaBodegaEmpaque
        modal={modal}
        setModal={setModal}
        register={registerDetails}
        errors={errorsDetails}
      />
    </>
  );
};

export default CreateBodegaSalidaEmpaque;
