import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { TaskProductionItem } from '@/types/taskProductionPlanTypes';
import InputComponent from '../form/InputComponent';
import Error from '../utilities-components/Error';
import ModalRadixUI from '../ModalRadixUI';
import { useNotification } from '../../core/notifications/NotificationContext';

export type DraftTaskProductionWastage = {
    packing_material_id: string;
    quantity: number;
    lote: string;
}

type Props = {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    selectedItem: TaskProductionItem;
    SetSelectedItem: Dispatch<SetStateAction<TaskProductionItem>>;
    setAuxItems: Dispatch<SetStateAction<TaskProductionItem[]>>;
    setWastages: Dispatch<SetStateAction<DraftTaskProductionWastage[]>>;
}


export default function ModalAddWastage({ modal, setModal, selectedItem, setAuxItems, setWastages, SetSelectedItem }: Props) {
    const notify = useNotification();
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm<DraftTaskProductionWastage>();

    const handleCloseModal = () => {
        setModal(false);
        SetSelectedItem({} as TaskProductionItem);
        reset();
    }

    const onSubmit = (data: DraftTaskProductionWastage) => {
        if (data.quantity > selectedItem.quantity) {
            notify.error('La cantidad no puede ser mayor');
            return;
        }

        data.lote = selectedItem.lote;
        data.packing_material_id = selectedItem.packing_material_id;

        setAuxItems((prev) =>
            prev.map(item =>
                item.packing_material_id === data.packing_material_id ? { ...item, quantity: data.quantity } : item
            )
        )

        data.quantity = selectedItem.quantity - data.quantity;

        setWastages((prev) => [...prev, data]);
        setModal(false);
        reset();
    }


    return (
        <ModalRadixUI modal={modal} closeModal={handleCloseModal} title={`Registro de Mermas - ${selectedItem.name ?? ''}`}>
            <div className='p-10'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    <InputComponent<DraftTaskProductionWastage>
                        label="Cantidad"
                        id="quantity"
                        name="quantity"
                        placeholder={`Cantidad de ${selectedItem.name ?? ''} que entregan`}
                        register={register}
                        validation={{ required: 'La cantidad es requerida' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.quantity && <Error>{errors.quantity?.message?.toString()}</Error>}
                    </InputComponent>

                    <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        <p>Registrar Merma</p>
                    </button>
                </form>
            </div>
        </ModalRadixUI>
    )
}
