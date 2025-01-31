import { Dialog, Transition } from "@headlessui/react";
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from "react";
import { useAppStore } from "../stores/useAppStore";
import { TaskCropIncomplete } from "../types";
import Spinner from "./Spinner";
import { formatDate } from "../helpers";
import ShowErrorAPI from "./ShowErrorAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function ModalTomaLibras() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();

  const [loadingGetTask, setLoadingGetTask] = useState<boolean>(false);
  const [errorGetTask, setErrorGetTask] = useState<boolean>(false);

  const [loadingCompleteAssigments, setLoadingCompleteAssigments] = useState<boolean>(false);

  const modalTomaLibras = useAppStore((state) => state.modalTomaLibras);
  const idTakeLbsData = useAppStore((state) => state.idTakeLbsData);

  const getIncompleteAssigments = useAppStore(
    (state) => state.getIncompleteAssigments
  );
  const getTasksCrop = useAppStore((state) => state.getTasksCrop);
  const completeAssigments = useAppStore((state) => state.completeAssigments);
  const [modal, useModal] = useState(modalTomaLibras);
  const [incompleteAssigments, setIncompleteAssigments] = useState<
    TaskCropIncomplete[]
  >([]);
  const closeModal = useAppStore((state) => state.closeModal);

  const hasValidData = useMemo(
    () =>
      Array.isArray(incompleteAssigments) &&
      incompleteAssigments.some(
        (assignment) =>
          assignment.lbs_planta !== null && assignment.lbs_planta > 0
      ),
    [incompleteAssigments]
  );

  const handleGerIncompleteAssigments = async () => {
    setLoadingGetTask(true);
    try {
      if (modalTomaLibras) {
        const assigments = await getIncompleteAssigments(idTakeLbsData);
        setIncompleteAssigments(assigments);
      }
    } catch (error) {
      setErrorGetTask(true);
    } finally {
      setLoadingGetTask(false);
    }
  };

  useEffect(() => {
    useModal(modalTomaLibras);
  }, [modalTomaLibras]);

  useEffect(() => {
    handleGerIncompleteAssigments();
  }, [modalTomaLibras]);

  const handleChange = (
    id: TaskCropIncomplete["id"],
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (value <= 0) {
      toast.error("Las libras ingresdasadas deben ser mayor a 0");
      return;
    }
    setIncompleteAssigments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lbs_planta: +e.target.value } : item
      )
    );
  };

  const SaveData = async () => {
    const completedAssigments = incompleteAssigments.filter(
      (item) => item.lbs_planta != null && item.lbs_planta > 0
    );
    setLoadingCompleteAssigments(true);
    try {
      await completeAssigments(completedAssigments);
      closeModal();
      toast.success("Registro Guardado Correctamente");
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasksCrop(lote_plantation_control_id,weekly_plan_id);
      }
    } catch (error) {
      toast.error("Hubo un error al cerrar la asignación, intentelo de nuevo más tarde");
    }finally {
      setLoadingCompleteAssigments(false);
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl sm:w-full sm:max-w-3xl">
                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                  <h3 className="text-xl font-bold uppercase">
                    Toma de Libras Planta
                  </h3>
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6">
                  {loadingGetTask && (
                    <div className="flex justify-center py-10">
                      <Spinner />
                    </div>
                  )}
                  {errorGetTask && <ShowErrorAPI />}
                  {!loadingGetTask && !errorGetTask && (
                    <div className="space-y-6">
                      {incompleteAssigments.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-100 rounded-lg shadow-md p-5 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-lg font-semibold">
                              Fecha: {formatDate(item.date)}
                            </p>
                            <p className="text-sm">
                              <span className="font-bold">Libras Finca:</span>{" "}
                              {item.lbs_finca} lbs
                            </p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <input
                              type="number"
                              placeholder="Libras Planta"
                              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                              onChange={(e) => handleChange(item.id, e)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    disabled={!hasValidData}
                    className={`mt-10 w-full ${
                      !hasValidData
                        ? "p-2 font-bold opacity-50 uppercase cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                        : "button bg-indigo-500 hover:bg-indigo-800"
                    }`}
                    onClick={() => SaveData()}
                  >
                    {loadingCompleteAssigments ? (
                      <Spinner />
                    ) : (
                    <p className="font-bold text-lg">Registrar Libras</p>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
