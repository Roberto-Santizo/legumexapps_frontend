import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { Boleta, BoletasPaginate, updateGRN } from "@/api/ReceptionsDocAPI";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

type Props = {
    modal: boolean;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    boleta: Boleta;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<BoletasPaginate>>;
}

type FormData = {
    grn: string;
}

export default function BoletaGRNModal({ modal, boleta, setModal, refetch }: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: updateGRN,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            refetch();
        }
    });

    const onSubmit = async (data: FormData) => mutate({ grn: data.grn, id: boleta.id });

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
                                    <h2 className="font-bold text-3xl">Generación de GRN</h2>
                                    <form noValidate className="space-y-5 mx-auto mt-10" onSubmit={handleSubmit(onSubmit)}>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-lg font-bold uppercase" htmlFor="grn">
                                                GRN:
                                            </label>
                                            <input
                                                autoComplete="off"
                                                id="grn"
                                                type="text"
                                                placeholder="GRN"
                                                className="border border-black p-3"
                                                {...register('grn', {
                                                    required: 'El grn es obligatorio'
                                                })}
                                            />
                                            {errors.grn && <Error>{errors.grn?.message?.toString()}</Error>}
                                        </div>

                                        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                                            {isPending ? <Spinner /> : <p>Generar GRN</p>}
                                        </button>
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
