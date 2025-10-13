import { useLocation, useNavigate } from "react-router-dom";
import Modal from "@/components/Modal";

export default function ModalEditTask() {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editTask')!;
    const show = taskId ? true : false;

    return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Editar Guia de Tarea">
            <div className="p-5">
                <p>aca</p>
            </div>
        </Modal>

    );
}
