import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { assignEmployeesToGroup, getFincaGroups } from "@/api/TasksWeeklyPlanAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import InputSelectComponent from "../form/InputSelectComponent";

type Props = {
    ids: number[];
    loteId: string;
    setAssignmentIds: Dispatch<SetStateAction<number[]>>;
}

export default function ModalAssignGroup({ ids, loteId, setAssignmentIds }: Props) {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('assignGroup');
    const open = modal ? true : false;
    const navigate = useNavigate();
    const id = params.plan_id!!;
    const fincaId = params.finca_id!!;

    const queryClient = useQueryClient();

    const { data: groups } = useQuery({
        queryKey: ['getFincaGroups', fincaId],
        queryFn: () => getFincaGroups(fincaId),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<{ group_id: string }>();

    const handleCloseModal = () => navigate(location.pathname);

    const { mutate, isPending } = useMutation({
        mutationFn: assignEmployeesToGroup,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getPlanificationEmployee', id, loteId] });
            handleCloseModal();
            setAssignmentIds([]);
            reset();
        }
    });



    const groupsOptions = groups?.map((group) => ({
        value: `${group.id}`,
        label: `${group.code}`,
    }));


    const onSubmit = (data: { group_id: string }) => {
        const formatedIds = ids.map(id => {
            return {
                assign_id: id
            }
        })
        mutate({ ids: formatedIds, groupId: data.group_id });
    };

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

                        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                            {isPending ? <Spinner /> : <p>Asignar</p>}
                        </button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
