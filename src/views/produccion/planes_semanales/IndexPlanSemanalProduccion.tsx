import { useEffect, useState } from "react";
import { getPaginatedWeeklyProductionPlans, WeeklyPlanProductionPlan } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Pagination from "@/components/Pagination";
import { Eye } from "lucide-react";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

export default function IndexPlanSemanalProduccion() {
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [plans, setPlans] = useState<WeeklyPlanProductionPlan[]>([]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedWeeklyProductionPlans', currentPage],
        queryFn: () => getPaginatedWeeklyProductionPlans(currentPage)
    });

    useEffect(() => {
        if (data) {
            setPlans(data.data);
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

            <div className="mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th className="thead-th"></th>
                            <th className="thead-th">Año</th>
                            <th className="thead-th">Semana</th>
                            <th className="thead-th">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr className="tbody-tr">
                                <td className="tbody-td"><CheckBadgeIcon className="w-8 text-green-500"/></td>
                                <td className="tbody-td">{plan.year}</td>
                                <td className="tbody-td">{plan.week}</td>
                                <td className="tbody-td">
                                    <Eye className="cur"/>
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
        </>
    )
}
