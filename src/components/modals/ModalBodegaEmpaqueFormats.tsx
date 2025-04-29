import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import SalidaBodegaEmpaque from "../boleta-bodega/SalidaBodegaEmpaque";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalBodegaEmpaqueFormats({open,setOpen} : Props) {
  return (
    <Modal modal={open} closeModal={() => setOpen(false)} title="Agregar Insumo" width="w-2/3">
        <div className="p-10">
            <SalidaBodegaEmpaque />
        </div>
    </Modal>
  )
}
