import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DraftTransactionPackingMaterial } from './ModalEntregaMaterialEmpaque';
import { createPackingMaterialTransaction } from '@/api/PackingMaterialTransactionsAPI';
import { TaskProductionItem } from '@/types/taskProductionPlanTypes';
import { getTaskReturnPackingMaterialDetails } from '@/api/TaskProductionPlansAPI';
import { useAppStore } from '@/store';
import ModalAddWastage, { DraftTaskProductionWastage } from './ModalAddWastage';
import Modal from '../Modal';
import InputComponent from "../form/InputComponent";
import Spinner from "../utilities-components/Spinner";
import Error from "../utilities-components/Error";
import SignatureField from "../form/SignatureComponent";
import SignatureCanvas from "react-signature-canvas";
import { useNotification } from '../../core/notifications/NotificationContext';

export default function ModalReturnPackingMaterial() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('devolutionTaskId')!;
    const show = (taskId) ? true : false;
    const params = useParams();
    const date = queryParams.get('date') ?? '';
    const plan_id = params.plan_id!;
    
    const [auxItems, setAuxItems] = useState<TaskProductionItem[]>([]);
    const [wastages, setWastages] = useState<DraftTaskProductionWastage[]>([]);
    const [selectedItem, setSelectedItem] = useState<TaskProductionItem>({} as TaskProductionItem);
    const [difference, setDifference] = useState<number>(0);
    const [modal, setModal] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const responsableSignatureRef = useRef({} as SignatureCanvas);
    const userRef = useRef({} as SignatureCanvas);
    const navigate = useNavigate();
    const notify = useNotification();

    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);


    const { data, isLoading } = useQuery({
        queryKey: ['getTaskReturnPackingMaterialDetails', taskId],
        queryFn: () => getTaskReturnPackingMaterialDetails({ id: taskId }),
        enabled: !!taskId
    });


    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("devolutionTaskId");
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const handleClickItem = (item: TaskProductionItem) => {
        setSelectedItem(item);
        setModal(true);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createPackingMaterialTransaction,
        onError: (error) => notify.error(error.message),
        onSuccess: (data) => {
            handleCloseModal();
            notify.success(data);
            reset();
            setSelectedItem({} as TaskProductionItem);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
            queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        reset,
    } = useForm<DraftTransactionPackingMaterial>();


    useEffect(() => {
        if (data) {
            if (!data.data.available) {
                handleCloseModal();
                notify.error('La boleta ya cuenta con registro de devolución');
            } else {
                setAuxItems(data.data.items);
            }
        }
    }, [data]);

    useEffect(() => {
        const prevItem = auxItems.filter(item => item.packing_material_id === selectedItem.packing_material_id)[0];
        let difference = 0;

        if (prevItem && selectedItem) {
            difference = prevItem.quantity - selectedItem.quantity;
        }

        setDifference(difference);

    }, [auxItems]);


    const onSubmit = (data: DraftTransactionPackingMaterial) => {
        data.items = auxItems;
        data.task_production_plan_id = taskId;
        data.type = "2";
        data.wastages = wastages;
        mutate(data);
    }

    return (
        <Modal
            modal={show}
            closeModal={() => handleCloseModal()}
            title="Devolución Material Empaque"
            width="w-full sm:w-4/5 lg:w-2/3"
        >
            <div className="p-4 sm:p-6 md:p-10 bg-gradient-to-br from-gray-50 to-white space-y-5">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {auxItems.map((item) => (
                            <div
                                key={item.packing_material_id}
                                className="bg-white/80 flex flex-col items-center justify-center text-center backdrop-blur-md rounded-2xl p-6 shadow-xl ring-1 ring-gray-200 hover:ring-blue-400 hover:shadow-2xl transition-all duration-300"
                                onClick={() => handleClickItem(item)}
                            >
                                <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">{item.name}</p>
                                <p className="text-sm font-medium text-blue-600">{item.lote}</p>
                                <p
                                    className={`${selectedItem.packing_material_id === item.packing_material_id && !modal
                                        ? "animate-pulseScale"
                                        : ""
                                        } text-3xl font-bold text-gray-900 mt-2`}
                                >
                                    {item.quantity}
                                    {selectedItem.packing_material_id === item.packing_material_id && !modal && (
                                        <span className="text-red-400">{` ${difference}`}</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        <InputComponent
                            label="Referencia"
                            id="reference"
                            name="reference"
                            placeholder="Referencia de Transferencia"
                            register={register}
                            validation={{ required: "El referencia de transferencia es requerida" }}
                            errors={errors}
                            type="text"
                        >
                            {errors.reference && <Error>{errors.reference.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent
                            label="Responsable"
                            id="responsable"
                            name="responsable"
                            placeholder="Nombre del Responsable"
                            register={register}
                            validation={{ required: "El nombre es requerido" }}
                            errors={errors}
                            type="text"
                        >
                            {errors.responsable && <Error>{errors.responsable.message?.toString()}</Error>}
                        </InputComponent>
                    </div>

                    <fieldset className="border rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
                        <legend className="text-lg font-semibold text-gray-700 px-2">Firmas</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SignatureField
                                label="Firma"
                                name="responsable_signature"
                                control={control}
                                errors={errors}
                                canvasRef={responsableSignatureRef}
                            />
                            <SignatureField
                                label="Firma de bodega"
                                name="user_signature"
                                control={control}
                                errors={errors}
                                canvasRef={userRef}
                            />
                        </div>
                    </fieldset>

                    <InputComponent
                        label="Observaciones"
                        id="observations"
                        name="observations"
                        placeholder="Observaciones Generales"
                        register={register}
                        validation={{}}
                        errors={errors}
                        type="text"
                    >
                        {errors.observations && <Error>{errors.observations.message?.toString()}</Error>}
                    </InputComponent>

                    <button
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 uppercase"
                    >
                        {isPending ? <Spinner /> : "CREAR"}
                    </button>
                </form>
            </div>

            <ModalAddWastage
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
                setAuxItems={setAuxItems}
                setWastages={setWastages}
                SetSelectedItem={setSelectedItem}
            />
        </Modal>

    )
}
