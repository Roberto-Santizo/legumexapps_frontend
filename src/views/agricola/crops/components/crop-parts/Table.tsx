import { CropPart } from "../../types"

type Props = {
    data: CropPart[];
}

export default function Table({ data }: Props) {
    return (
        <table className="table mt-10">
            <thead>
                <tr className="thead-tr">
                    <th scope="col" className="thead-th">
                        Parte
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((crop) => (
                    <tr className="tbody-tr" key={crop.id}>
                        <td className="tbody-td">{crop.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
