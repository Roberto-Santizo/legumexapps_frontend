import { useEffect, useState } from "react";
import { getWeeklyProductionPlans } from "@/api/WeeklyProductionPlanAPI";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CalendarRange, Clock, Eye } from "lucide-react";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { Link, useNavigate } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";
import ModalCreateProductionPlan from "@/components/modals/ModalCreateProductionPlan";
import ModalErrorsTable from "@/components/modals/ModalErrorsTable";
import MenuOptionsProduction from "@/components/planes-semanales-produccion/MenuOptionsProduction";

export default function IndexPlanSemanalProduccion() {
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [plans, setPlans] = useState<WeeklyProductionPlan[]>([]);
    const { hasPermission } = usePermissions();

    const [errores, setErrores] = useState<string[]>([]);
    const [modalErrors, setModalErrors] = useState<boolean>(false);

    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedWeeklyProductionPlans', currentPage],
        queryFn: () => getWeeklyProductionPlans({ page: currentPage, paginated: 'true' }),
        placeholderData: keepPreviousData
    });

    useEffect(() => {
        if (data) {
            setPlans(data.data);
        }
        if (data?.meta) {
            setCurrentPage(data.meta.current_page);
            setPageCount(data.meta.last_page);
        }
    }, [data]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />
    return (
        <>
            <h1 className="font-bold text-4xl">Plan Semanal Produccion</h1>
            {hasPermission('create plan production semanal') && (
                <div className="flex flex-row justify-end gap-5 mb-5">
                    <div className="flex flex-row justify-end gap-5">
                        <button
                            onClick={() => navigate(`${location.pathname}?createPlan=true`)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon className="w-8" />
                            <p>crear plan semanal</p>
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th className="thead-th">Estatus</th>
                            <th className="thead-th">Año</th>
                            <th className="thead-th">Semana</th>
                            <th className="thead-th">Acción</th>
                            <th className="thead-th">Reporteria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr className="tbody-tr" key={plan.id}>
                                <td className="tbody-td">
                                    {plan.completed ? (
                                        <CheckBadgeIcon className="w-8 text-green-500" />
                                    ) : (
                                        <Clock className="w-8 text-orange-500" />
                                    )}
                                </td>
                                <td className="tbody-td">{plan.year}</td>
                                <td className="tbody-td">{plan.week}</td>

                                <td className="tbody-td flex gap-5">
                                    <Link to={`/planes-produccion/${plan.id}`}>
                                        <Eye />
                                    </Link>

                                    {hasPermission('see production plan calendar') && (
                                        <Link to={`/planes-produccion/calendario/${plan.id}`}>
                                            <CalendarRange />
                                        </Link>
                                    )}
                                </td>

                                <td className="tbody-td">
                                    <MenuOptionsProduction plan_id={plan.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mb-10 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>

            <ModalCreateProductionPlan setErrors={setErrores} setModalErrors={setModalErrors} currentPage={currentPage} />
            <ModalErrorsTable modal={modalErrors} setModal={setModalErrors} errors={errores} />
        </>
    )
}
