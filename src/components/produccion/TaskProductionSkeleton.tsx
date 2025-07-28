export default function TaskProductionSkeleton() {
    return (
        <>
            <div className="mb-6 text-center">
                <h2 className="text-base xl:text-xl font-semibold text-gray-700">
                    Consultando datos del biométrico...
                </h2>
                <p className="text-sm text-gray-500">
                    Esto puede tomar un poco de tiempo. Por favor, espera.
                </p>
            </div>

            <div className="flex flex-col xl:grid xl:grid-cols-6 gap-8 shadow-xl rounded-2xl bg-white p-8 xl:p-10 xl:text-xl text-xs animate-pulse">
                <div className="col-span-6 md:col-span-5 space-y-5">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="h-3 w-28 bg-gray-200 rounded-md"></div>
                            <div className="h-4 w-full bg-gray-300 rounded-md"></div>
                        </div>
                    ))}

                    <div className="mt-6">
                        <span className="inline-block bg-gray-300 h-8 w-44 rounded-md shadow"></span>
                    </div>
                </div>

                <div className="col-span-6 md:col-span-1 flex flex-col justify-center items-center space-y-6">
                    <div className="flex xl:flex-col gap-4 items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    )
}
