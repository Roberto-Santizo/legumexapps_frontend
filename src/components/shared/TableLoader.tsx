export default function TableLoader({ columns }: { columns: number }) {
    return (
        <div className="animate-pulse mt-5 w-full">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Array.from({ length: 5 }).map((_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
