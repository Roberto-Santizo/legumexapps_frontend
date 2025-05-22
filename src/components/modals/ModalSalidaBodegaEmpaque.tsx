import { DraftSalidaDetails } from "@/views/bodega/salida-bodega-empaque/CreateBodegaSalida-empaque";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import InputComponent from "../form/InputComponent";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  modal: boolean;
  setModal: (open: boolean) => void;
  errors: FieldErrors<DraftSalidaDetails>;
  register: UseFormRegister<DraftSalidaDetails>;
};

export default function ModalSalidaBodegaEmpaque({
  modal,
  setModal,
  errors,
  register,
}: Props): JSX.Element {
  return (
    <div>
      <Modal
        modal={modal}
        closeModal={() => setModal(false)}
        title="Registrar Salida de Bodega Empaque"
      >
        <form onSubmit={(e) => e.preventDefault()} className="p-7 space-y-5">
          <InputComponent<DraftSalidaDetails>
            label="Cantidad"
            id="quantity"
            name="quantity"
            placeholder="La cantidad es requerida"
            register={register}
            validation={{
              required: "La el responsable de bolsa es obligatorio",
            }}
            errors={errors}
            type={"text"}
          >
            {errors.quantity && (
              <Error>{errors.quantity?.message?.toString()}</Error>
            )}
          </InputComponent>

          <InputComponent<DraftSalidaDetails>
            label="Lote"
            id="lote"
            name="lote"
            placeholder="Ingrese el lote"
            register={register}
            validation={{ required: "El lote es obligatorio" }}
            errors={errors}
            type={"number"}
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
