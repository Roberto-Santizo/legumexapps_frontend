import { usePermissions } from "@/hooks/usePermissions";
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { DownloadIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { downloadPackingMaterialNecessity, downloadWeeklyProductionPlan } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { downloadBase64File } from "@/helpers";
import { WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";


export default function MenuOptionsProduction({ plan_id }: { plan_id: WeeklyProductionPlan['id'] }) {
    const { hasPermission } = usePermissions();

    const { mutate } = useMutation({
        mutationFn: downloadPackingMaterialNecessity,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            if (data) {
                downloadBase64File(data?.file, data?.fileName);
            }
        }
    });

    const { mutate: mutateProductionPlan } = useMutation({
        mutationFn: downloadWeeklyProductionPlan,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            if (data) {
                downloadBase64File(data?.file, data?.fileName);
            }
        }
    });

    return (
        <div className="tbody-td flex gap-10">
            <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                        className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none space-y-2"
                    >
                        {hasPermission('create mp transactions') && (
                            <Menu.Item>
                                <button onClick={() => mutate({ plan_id })} className='flex justify-center items-center gap-2 px-3 py-1 text-sm leading-6 hover:text-gray-400'>
                                    <DownloadIcon className="w-4 h-4" />
                                    <p>Reporte Necesidad Material Empaque</p>
                                </button>
                            </Menu.Item>
                        )}

                        <Menu.Item>
                            <button onClick={() => mutateProductionPlan({ plan_id })} className='flex justify-center items-center gap-2 px-3 py-1 text-sm leading-6 hover:text-gray-400'>
                                <DownloadIcon className="w-4 h-4" />
                                <p>Reporte Producción Semanal</p>
                            </button>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}
