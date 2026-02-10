import { getCropDiseaseSymptonsById } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";

export default function SymptomList() {
    const params = useParams();
    const diseaseId = params.diseaseId!;
    const navigate = useNavigate();

    const { data: symptoms, isLoading: loadingSymptoms } = useQuery({
        queryKey: ['getCropDiseaseSymptonsById', diseaseId],
        queryFn: () => getCropDiseaseSymptonsById({ diseaseId: +diseaseId, loteId: '' })
    });

    if (symptoms) return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between">
                <h2 className="text-lg font-medium text-gray-800">
                    Síntomas
                </h2>

                <button onClick={() => navigate('?addSymptom=true')} className="button bg-indigo-600 hover:bg-indigo-800">
                    Agregar Sintoma
                </button>
            </div>

            {loadingSymptoms && <Spinner />}

            {!loadingSymptoms && (!symptoms || symptoms.length === 0) && (
                <p className="text-sm text-gray-500">
                    No hay síntomas registrados.
                </p>
            )}

            <ul className="space-y-2">
                {symptoms.map((symptom) => (
                    <li
                        key={symptom.id}
                        className="flex items-start gap-3 text-sm text-gray-700"
                    >
                        <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        {symptom.symptom}
                    </li>
                ))}
            </ul>

        </div>
    )
}
