import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getFincaGroups } from "@/api/TasksWeeklyPlanAPI";
import { useQuery } from "@tanstack/react-query";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import InputSelectComponent from "../form/InputSelectComponent";

export default function ModalAssignGroup() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('assignGroup');
    const open = modal ? true : false;
    const navigate = useNavigate();
    const params = useParams();
    const fincaId = params.finca_id!!;


    const { data: groups } = useQuery({
        queryKey: ['getFincaGroups', fincaId],
        queryFn: () => getFincaGroups(fincaId),
    });
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ group_id: string }>();

    const groupsOptions = groups?.map((group) => ({
        value: `${group.id}`,
        label: `${group.code}`,
    }));

    const handleCloseModal = () => navigate(location.pathname);

    const onSubmit = () => {

    }

    if (groupsOptions) return (
        <Modal modal={open} closeModal={() => handleCloseModal()} title="Crear Grupo">
            <div className="flex items-center justify-center">
                <div className="w-full  bg-white shadow-xl rounded-2xl p-10">
                    <form
                        className="space-y-5 mx-auto"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <InputSelectComponent<{ group_id: string }>
                            label="Grupo"
                            id="group_id"
                            name="group_id"
                            options={groupsOptions}
                            register={register}
                            validation={{ required: 'El grupo es obligatario' }}
                            errors={errors}
                        >
                            {errors.group_id && <Error>{errors.group_id?.message?.toString()}</Error>}
                        </InputSelectComponent>

                        <button disabled={false} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                            {false ? <Spinner /> : <p>Asignar</p>}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
