import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import CreateTareaLote from "@/views/agricola/plans/CreateTareaLote";

export default function ModalCreateActivity() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('createActivity')!;
    const show = modal ? true : false;
    const navigate = useNavigate();

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Actividad">
            <div className="p-10">
                <CreateTareaLote />
            </div>
        </Modal>
    )
}
