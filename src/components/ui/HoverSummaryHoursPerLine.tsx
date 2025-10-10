import { getLineHoursPerWeek } from "@/api/LinesAPI";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useQuery } from "@tanstack/react-query";
import { BookIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { WeeklyProductionPlan } from "@/types/weeklyProductionPlanTypes";
import { useEffect, useState } from "react";
import Spinner from "../utilities-components/Spinner";

export default function HoverSummaryHoursPerLine() {
    const params = useParams<{ plan_id: WeeklyProductionPlan['id'] }>();
    const weeklyplanId = params.plan_id!!;
    const [animate, setAnimate] = useState<boolean>(false);

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['getLineHoursPerWeek', weeklyplanId],
        queryFn: () => getLineHoursPerWeek({ weeklyplanId })
    });

    useEffect(() => {
        if (isFetching) {
            setAnimate(true);

            setTimeout(() => {
                setAnimate(false);
            }, 2200);
        }
    }, [isFetching]);

    return (
        <HoverCard.Root>
            <HoverCard.Trigger asChild>
                <button
                    className={`${animate ? 'animate-bounce' : ''} fixed bottom-6 right-6 z-[9999] bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition`}
                >
                    <BookIcon />
                </button>
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content
                    className="z-[99999] bg-white rounded-xl p-6 shadow-lg space-y-4 w-96 h-96 data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                    sideOffset={5}
                >
                    <h2 className="text-xl font-semibold text-gray-800 pb-2">Resumen de Horas Semanales por Línea</h2>
                    {isLoading && <Spinner />}
                    <div className="divide-y divide-gray-200 overflow-y-auto max-h-[16rem] scrollbar-hide space-y-2">
                        {(data?.length === 0 && !isLoading) ? (
                            <p className="text-center">No existen datos programados</p>
                        ) : (
                            <>
                                {data?.map((summary, index) => (
                                    <div key={index} className="flex justify-between py-2">
                                        <span className="text-gray-600 font-medium">{summary.line}</span>
                                        <span className="text-gray-900 font-semibold">{summary.total_hours.toFixed(2)} hrs</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <HoverCard.Arrow className="fill-white" />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
