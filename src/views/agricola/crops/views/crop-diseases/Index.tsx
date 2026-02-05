import { getCropDiseases } from "../../api/api";
import { PlusIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ModalCreateCropDisease from "../../components/crop-diseases/ModalCreateCropDisease";
import Spinner from "@/components/utilities-components/Spinner";
import Table from "../../components/crop-diseases/Table";
import Title from "@/components/shared/Title";

export default function Index() {
    const params = useParams();
    const navigate = useNavigate();
    const id = params.id!

    const { data, isLoading } = useQuery({
        queryKey: ['getCropDiseases', id],
        queryFn: () => getCropDiseases(+id)
    });

    if (isLoading) return <Spinner />

    if (data) return (
        <div>
            <Title title='Enfermedades de Cultivo' size='text-4xl' />

            <div className="flex justify-end mt-4">
                <button className="button bg-indigo-600 hover:bg-indigo-800 flex gap-2" onClick={() => navigate('?create=true')}>
                    <PlusIcon />
                    Crear
                </button>
            </div>
            <Table data={data} />

            <ModalCreateCropDisease />
        </div>
    )
}
