
export default function TaskProductionAsignacionSkeleton() {
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
            <div className="space-y-10 mb-10 animate-pulse">
                <div className="h-10 w-40 bg-gray-300 rounded"></div>
                <div className="p-5 shadow-xl grid grid-cols-2 gap-8 bg-white rounded-lg">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                <div className="h-4 w-48 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end items-start">
                        <div className="h-10 w-48 bg-gray-300 rounded-md"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <div className="text-center bg-gray-300 p-2 rounded font-bold text-white mb-4 w-2/3 mx-auto"></div>
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center gap-3 px-5 py-3 rounded-lg shadow-md border border-gray-300 bg-white"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-gray-300 p-2 rounded-full w-8 h-8"></div>
                                        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shadow bg-white rounded-lg">
                        <div className="text-center bg-gray-300 p-2 font-bold text-white mb-4 w-2/3 mx-auto"></div>
                        <div className="max-h-96 overflow-y-auto space-y-2 px-4 py-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-2xl px-6 py-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="flex flex-col gap-2 w-1/3">
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-full bg-gray-300 rounded"></div>
                                        </div>
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                        <div className="flex flex-col gap-2 w-1/3">
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                            <div className="h-4 w-full bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full h-12 bg-gray-300 rounded-md"></div>
            </div>
        </>
    )
}
