import { useNavigate } from "react-router-dom";

interface TableProps<T> {
    data: T[];
    columns: (keyof T)[];
    navigateCol: keyof T;
    navigateUrl: string;
}

export default function Table<T>({ columns, data, navigateUrl, navigateCol }: TableProps<T>) {
    const navigate = useNavigate();

    return (
        <table className="table mt-5">
            <thead>
                <tr className="thead-tr">
                    {columns.map((column, index) => (
                        <th key={index} scope="col" className="thead-th">
                            {column.toString()}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr className="tbody-tr" key={i} onClick={() => {
                        const url = `${navigateUrl}/${row[navigateCol]}`;
                        navigate(url)
                    }}>
                        {columns.map(col => (
                            <td className="tbody-td" key={col.toString()}>{String(row[col])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
