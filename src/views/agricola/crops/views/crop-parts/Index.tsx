import { getCropParts } from "../../api/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import Table from "../../components/crop-parts/Table";
import Title from "@/components/shared/Title";

export default function Index() {
    const params = useParams();
    const id = params.id!;

    const { data, isLoading } = useQuery({
        queryKey: ['getCropParts', id],
        queryFn: () => getCropParts(+id)
    });

    if (isLoading) return <Spinner />
    if (data) return (
        <div>
            <Title title='Partes de Cultivo' size='text-4xl' />

            <Table data={data} />
        </div>
    )
}
