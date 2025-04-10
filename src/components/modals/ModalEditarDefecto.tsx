import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DraftDefecto } from "./ModalCrearDefecto";
import Spinner from "../utilities-components/Spinner";
import DefectForm from "../defectos/DefectForm";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDefects: React.Dispatch<React.SetStateAction<DraftDefecto[]>>;
    defects: DraftDefecto[];
    id: DraftDefecto['id'];
}

export default function ModalEditarDefecto({ modal, setModal, setDefects, defects, id }: Props) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DraftDefecto>();

    const onSubmit = async (data: DraftDefecto) => {
        setLoading(true);
        try {
            setDefects((prev) => prev.map((defect) => defect.id === id ? data : defect));
            reset();
            setModal(!modal);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (modal && id) {
            const defect_data = defects.find((defect) => defect.id === id);
            if (defect_data) {
                reset(defect_data);
            }
        }
    }, [id, modal]);
    return (
        <Modal modal={modal} closeModal={() => setModal(false)} title="Editar Defecto">
            <form noValidate className="space-y-5 mx-auto p-10" onSubmit={handleSubmit(onSubmit)}>

                <DefectForm register={register} errors={errors} />

                <button disabled={loading} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                  {loading ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>

    );
}
