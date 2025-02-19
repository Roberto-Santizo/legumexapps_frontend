import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@mui/material";
import Spinner from "../Spinner";
import { DraftDefecto } from "@/types";
import DefectForm from "./DefectForm";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDefects: React.Dispatch<React.SetStateAction<DraftDefecto[]>>;
    defects: DraftDefecto[];
}

export default function CreateDefectoModal({ modal, setModal,setDefects, defects }: Props) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DraftDefecto>();


    const onSubmit = async (data: DraftDefecto) => {
        data.id = defects.length + 1;
        setLoading(true);
        try {
            setDefects((prev) => [...prev, data]);
            reset();
            setModal(!modal);
        } catch (error) {
            console.error(error);
        }finally{
            setLoading(false);
        }
    }
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setModal(!modal)}>
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="p-7">
                                    <h2 className="font-bold text-3xl">Relacionar Defecto</h2>
                                    <form noValidate className="space-y-5 w-2/3 mx-auto mt-10" onSubmit={handleSubmit(onSubmit)}>
                                        
                                        <DefectForm register={register} errors={errors} />

                                        <Button
                                            disabled={loading}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{ marginTop: 2 }}
                                        >
                                            {loading ? (
                                                <Spinner />
                                            ) : (
                                                <p className="font-bold text-lg">Crear Defecto</p>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
