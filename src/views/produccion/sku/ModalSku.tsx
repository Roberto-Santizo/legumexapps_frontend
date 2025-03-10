import  { useState } from "react";
import Modal from "react-modal";
import TaskLabel from "../../../components/TaskLabel";
import { CircleCheck, PlayCircleIcon } from "lucide-react";

Modal.setAppElement("#root"); 

export default function ModalSku() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Inicio de SKU
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Plan Semanal de Producción"
        className="bg-white p-10 rounded-lg shadow-xl max-w-5xl w-[70%] h-[30vh] mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
          <div className="col-span-5">
            <TaskLabel label={"ID"} text={"Insertar dato aca"} />
            <TaskLabel label={"Linea"} text={"Insertar dato aca"} />
            <TaskLabel label={"Sku"} text={"Insertar dato aca"} />
            <TaskLabel label={"Linea"} text={"Insertar dato aca"} />
            <TaskLabel label={"Tarimas"} text={"Insertar dato aca"} />
          </div>

          <div className="col-start-7 space-y-5">
            <div className="flex flex-col justify-center items-center gap-4">
              <PlayCircleIcon className="cursor-pointer text-green-500 hover:text-green-400" />
              <CircleCheck className="cursor-pointer hover:text-green-400" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
