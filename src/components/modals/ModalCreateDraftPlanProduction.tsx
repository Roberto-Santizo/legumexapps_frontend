import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Modal";


export default function ModalCreateDraftPlanProduction() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('newDraftPlanification')!;
    const show = modal ? true : false;

    const navigate = useNavigate();


    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    }
    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Draft Planificación de Producción">
            <div className="flex items-center justify-center px-4">

            </div>
        </Modal>
    )
}
