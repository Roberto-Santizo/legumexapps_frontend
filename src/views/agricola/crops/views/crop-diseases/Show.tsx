import "yet-another-react-lightbox/styles.css";
import { getCropDiseaseById } from "../../api/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FormAddImage from "../../components/crop-diseases/FormAddImage";
import ImageGalery from "../../components/crop-diseases/ImageGalery";
import ModalAddSymptom from "../../components/crop-diseases/ModalAddSymptom";
import Spinner from "@/components/utilities-components/Spinner";
import SymptomList from "../../components/crop-diseases/SymptomList";

export default function Show() {
    const params = useParams();
    const diseaseId = params.diseaseId!;

    const { data, isLoading } = useQuery({
        queryKey: ['getCropDiseaseById', diseaseId],
        queryFn: () => getCropDiseaseById(+diseaseId)
    });

    if (isLoading) return <Spinner />;
    if (!data) return null;

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {data.name}
                </h1>

                <FormAddImage />
            </div>

            <SymptomList />
            <ImageGalery />
            <ModalAddSymptom />
        </div>
    );
}
