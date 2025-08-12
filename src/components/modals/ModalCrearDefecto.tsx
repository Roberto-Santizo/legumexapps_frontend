import { useState } from "react";
import { useForm } from "react-hook-form";
import DefectForm from "../defectos/DefectForm";
import Spinner from "../utilities-components/Spinner";
import Modal from "../Modal";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDefects: React.Dispatch<React.SetStateAction<DraftDefecto[]>>;
    defects: DraftDefecto[];
}

export type DraftDefecto = {
    id: number;
    name: string;
    tolerance_percentage: number;
    status: boolean;
}

export default function ModalCrearDefecto({ modal, setModal, setDefects, defects }: Props) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DraftDefecto>();


    const onSubmit = async (data: DraftDefecto) => {
        const maxId = defects.length > 0 ? Math.max(...defects.map(defect => defect.id)) + 1 : 0;
        data.id = maxId;
        setLoading(true);

        try {
            setDefects((prev) => [...prev, data]);
            reset();
            setModal(!modal);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal modal={modal} closeModal={() => setModal(false)} title="Relacionar Defecto">

            <form noValidate className="space-y-5 mx-auto p-10" onSubmit={handleSubmit(onSubmit)}>

                <DefectForm register={register} errors={errors} />

                <button disabled={loading} className="button bg-indigo-500 hover:bg-indigo-600 w-full text-xs md:text-base">
                  {loading ? <Spinner /> : <p>Relacionar Defecto</p>}
                </button>
            </form>
        </Modal>
    );
}
