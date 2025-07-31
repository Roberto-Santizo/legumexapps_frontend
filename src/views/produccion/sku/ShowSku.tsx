import { getSkuById, SKU } from "@/api/SkusAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BoxIcon, CookingPot } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalRawMaterialRecipe from "@/components/modals/ModalRawMaterialRecipe";

export default function ShowSku() {
    const params = useParams<{ id: SKU['id'] }>();
    const id = params.id!;
    const navigate = useNavigate();

    const { hasPermission } = usePermissions();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getSkuById', id],
        queryFn: () => getSkuById({ id }),
        enabled: !!id
    });

    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />
    if (data) return (
        <div className="space-y-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">SKU: {data.code}</h1>
                <p className="text-gray-600">Cliente: <span className="font-medium">{data.client_name}</span></p>
            </div>

            {hasPermission('administrate packing material recipe') && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-1 mb-4">Ingredientes - Material de Empaque</h2>
                    <ul className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-2">
                        {data.packing_material_recipe.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-xs mx-auto"
                            >
                                <div className="mb-4 text-blue-500">
                                    <BoxIcon className="w-10 h-10" />
                                </div>

                                <p className="text-base font-semibold text-gray-800 mb-1 text-center">
                                    {item.product}
                                </p>
                                <p className="text-base font-semibold text-gray-800 mb-1 text-center">
                                    {item.code}
                                </p>
                                <p className="text-sm text-gray-500 text-center">
                                    Libras por item: <span className="font-medium">{item.lbs_per_item}</span>
                                </p>
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            {hasPermission('administrate raw material recipe') && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Ingredientes - Materia Prima</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {data.raw_material_recipe.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-xs mx-auto"
                                onClick={() => navigate(`${location.pathname}?rawMaterialId=${item.id}`)}
                            >
                                <div className="mb-4 text-green-700">
                                    <CookingPot className="w-10 h-10" />
                                </div>
                                <p className="text-base font-semibold text-gray-800 mb-1 text-center">
                                    {item.product}
                                </p>
                                <p className="text-base text-gray-600 mb-1 text-center">
                                    Código: {item.code}
                                </p>
                                <p className="text-sm text-gray-500 text-center">
                                    Porcentaje por presentación: <span className="font-medium">{item.percentage}%</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ModalRawMaterialRecipe />
        </div>
    );
}
