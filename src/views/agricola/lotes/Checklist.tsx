import { AlertCircleIcon } from "lucide-react";
import { createLoteChecklist } from "@/api/LotesAPI";
import { getCropDiseaseSymptonsById } from "../crops/api/api";
import { LoteChecklistCondition } from "@/types/lotesType";
import { useEffect, useState, ChangeEvent } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "@/core/notifications/NotificationContext";
import ModalCropDiseaseImages from "@/components/modals/ModalCropDiseaseImages";
import Spinner from "@/components/utilities-components/Spinner";

export default function Checklist() {
    const params = useParams();
    const navigate = useNavigate();
    const notify = useNotification();

    const id = params.id!;

    const [data, setData] = useState<LoteChecklistCondition[]>([]);

    const { data: symptoms, isLoading } = useQuery({
        queryKey: ['getCropDiseaseSymptonsById', id],
        queryFn: () => getCropDiseaseSymptonsById({ diseaseId: null, loteId: id })
    });

    const isValidForm = data.some(item => !item.level || !item.observations);

    useEffect(() => {
        if (!symptoms) return;
        setData(
            symptoms.map(symptom => ({
                crop_disease_syptom_id: symptom.id,
                exists: false,
                level: '',
                observations: '--'
            }))
        );
    }, [symptoms]);

    const handleChangeInput = (id: number, e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, type, value } = e.target;

        setData(prev =>
            prev.map(item =>
                item.crop_disease_syptom_id === id
                    ? {
                        ...item,
                        [name]: (type === "text" || type === "select") ? e.target.value : value,
                        [name]: type === "checkbox" ? (e.target.checked ? 1 : 0) : value,
                    } : item
            )
        );
    };

    const { mutate, isPending } = useMutation({
        mutationFn: createLoteChecklist,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (message) => {
            notify.success(message!);
            navigate('/lotes');
        }
    });

    const handleSaveChecklist = () => {
        mutate({ formData: data, loteId: id });
    }

    if (isLoading) return <Spinner />;

    if (!symptoms?.length) {
        return (
            <div className="max-w-4xl mx-auto mt-10 text-center text-gray-500">
                No hay síntomas registrados
            </div>
        );
    }

    if (data && symptoms) return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                    Checklist de Síntomas
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Revisión visual de síntomas detectados en el cultivo
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Síntoma
                                </th>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Parte a revisar
                                </th>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Enfermedad
                                </th>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Presencia
                                </th>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Nivel de presencia
                                </th>
                                <th className="px-5 py-4 text-left font-semibold">
                                    Observaciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {symptoms.map((symptom, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-indigo-50/60 transition-colors"
                                >
                                    <td className="px-5 py-4 font-medium text-gray-800">
                                        {symptom.symptom}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                            {symptom.part}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-800 justify-between">
                                            {symptom.disease}
                                            <AlertCircleIcon className="w-4 h-4 text-indigo-500 opacity-80" onClick={() => navigate(`?showImages=${symptom.cropDiseaseId}`)} />
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-10 h-5"
                                            name="exists"
                                            checked={data.filter(info => info.crop_disease_syptom_id == symptom.id)[0]?.exists ?? false}
                                            onChange={(e) => handleChangeInput(symptom.id, e)}
                                        />
                                    </td>

                                    <td className="px-5 py-4">
                                        <select
                                            name="level"
                                            value={data.filter(info => info.crop_disease_syptom_id == symptom.id)[0]?.level ?? ""}
                                            onChange={(e) => handleChangeInput(symptom.id, e)}
                                        >
                                            <option value="">Seleccionar nivel</option>
                                            <option value="LOW">Bajo</option>
                                            <option value="MEDIUM">Medio</option>
                                            <option value="HIGH">Alto</option>
                                        </select>
                                    </td>

                                    <td className="px-5 py-4">
                                        <input
                                            value={data.filter(info => info.crop_disease_syptom_id == symptom.id)[0]?.observations ?? ''}
                                            onChange={(e) => handleChangeInput(symptom.id, e)}
                                            type="text"
                                            name="observations"
                                            placeholder="Agregar observaciones..."
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button disabled={isValidForm || isPending} onClick={() => handleSaveChecklist()} className={`${!isValidForm ? 'bg-indigo-500 hover:bg-indigo-800' : 'bg-gray-200 cursor-not-allowed'} button  w-full mt-5`}>
                {isPending ? <Spinner /> : <p>Cerrar Checklist</p>}
            </button>

            <ModalCropDiseaseImages />
        </div>
    );
}
