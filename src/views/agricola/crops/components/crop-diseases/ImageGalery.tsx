import { getCropDiseaseImagesById } from "../../api/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "../../components/crop-diseases/Image";
import Lightbox from "yet-another-react-lightbox";
import Spinner from "@/components/utilities-components/Spinner";

export default function ImageGalery() {
    const params = useParams();
    const diseaseId = params.diseaseId!;

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const { data: images, isLoading: loadingImages } = useQuery({
        queryKey: ['getCropDiseaseImagesById', diseaseId],
        queryFn: () => getCropDiseaseImagesById(+diseaseId)
    });

    const slides = images?.map(image => ({ id: image.id, src: `${import.meta.env.VITE_AWS_BUCKET_URL}${image.path}`})) ?? [];
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">
                    Imágenes
                </h2>
            </div>

            {loadingImages && <Spinner />}

            {!loadingImages && slides.length === 0 && (
                <p className="text-sm text-gray-500">
                    No hay imágenes disponibles.
                </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {slides.map((slide, i) => (
                    <Image
                        key={slide.id}
                        slide={slide}
                        i={i}
                        setIndex={setIndex}
                        setOpen={setOpen}
                    />
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={index}
            />
        </div>

    )
}
