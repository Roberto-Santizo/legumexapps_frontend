import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import SalidaBodegaEmpaque from "../boleta-bodega/SalidaBodegaEmpaque";
import DevolucionBodega from "../boleta-bodega/DevolucionBodega";
import { TaskProductionFinished } from "types/taskProductionPlanTypes";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: TaskProductionFinished;
}

export default function ModalTaskProductionTransactionsFormats({ open, setOpen, task }: Props) {
  return (
    <Modal modal={open} closeModal={() => setOpen(false)} title="Boleta Entrega Material de Empaque" width="w-2/3">
      <div className="p-10 space-y-5" >
        {task.transactions.map((transaction) => (
          <div key={transaction.id}>
            {transaction.type === 1 && (
              <SalidaBodegaEmpaque transaction={transaction} />
            )}
            {transaction.type === 2 && (
              <DevolucionBodega transaction={transaction} />
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}
