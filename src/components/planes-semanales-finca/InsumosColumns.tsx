import { downloadReportInsumos, downloadReportPlanilla } from "@/api/WeeklyPlansAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { WeeklyPlan } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import Spinner from "../utilities-components/Spinner";


export default function InsumosColumns({ planId }: { planId: WeeklyPlan['id'] }) {
    const { hasPermission } = usePermissions();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ planId }: { planId: WeeklyPlan['id'] }) => downloadReportInsumos(planId),
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const { mutate: downloadPlanilla, isPending: isPending2 } = useMutation({
        mutationFn: ({ planId }: { planId: WeeklyPlan['id'] }) => downloadReportPlanilla(planId),
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const handleDownloadInsumosReport = async (planId: WeeklyPlan['id']) => { mutate({ planId }) };
    const handleDownloadPlanillaReport = async (planId: WeeklyPlan['id']) => { downloadPlanilla({ planId }) };

    return (
        <td className="tbody-td flex gap-10 m-3">
            {(isPending || isPending2) ? <Spinner /> : (
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none space-y-2"
                        >
                            {hasPermission('download planilla report') && (
                                <Menu.Item>
                                    <button className='block px-3 py-1 text-sm leading-6 hover:text-gray-400' onClick={() => handleDownloadPlanillaReport(planId)}>
                                        Descargar Planilla
                                    </button>
                                </Menu.Item>
                            )}


                            <Menu.Item>
                                <button className='block px-3 py-1 text-sm leading-6 hover:text-gray-400' onClick={() => handleDownloadInsumosReport(planId)}>
                                    Descargar Reporte Insumos
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            )}

        </td>
    );
}
