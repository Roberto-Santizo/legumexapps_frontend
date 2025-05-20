import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import SalidaBodegaEmpaque from "../boleta-bodega/SalidaBodegaEmpaque";
import { FinishedTaskProductionDetails } from "@/api/WeeklyProductionPlanAPI";

type Props = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    task: FinishedTaskProductionDetails;
}

export default function ModalBodegaEmpaqueFormats({open,setOpen, task} : Props) {
  return (
    <Modal modal={open} closeModal={() => setOpen(false)} title="Boleta Entrega Material de Empaque" width="w-2/3">
        <div className="p-10">
            <SalidaBodegaEmpaque task={task}/>
        </div>
    </Modal>
  )
}
