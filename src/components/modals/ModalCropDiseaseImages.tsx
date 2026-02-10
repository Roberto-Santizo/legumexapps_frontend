import { getCropDiseaseImagesById } from "@/views/agricola/crops/api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Modal from "../Modal";

export default function ModalCropDiseaseImages() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('showImages')!;
    const open = !!modal;

    const navigate = useNavigate();

    const handleCloseModal = () => {
        navigate(location.pathname);
    };

    const { data: images, isLoading } = useQuery({
        queryKey: ['getCropDiseaseImagesById', modal],
        queryFn: () => getCropDiseaseImagesById(+modal),
        enabled: !!modal
    });

    return (
        <Modal modal={open} closeModal={handleCloseModal} title="Imágenes de la enfermedad">

            <div className="p-4">
                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-36 rounded-xl bg-gray-200"
                            />
                        ))}
                    </div>
                )}

                {!isLoading && images?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <ImageIcon className="w-10 h-10 mb-3 opacity-60" />
                        <p className="font-medium">
                            No existen imágenes para esta enfermedad
                        </p>
                    </div>
                )}

                {!isLoading && images && images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <img
                                    src={`${import.meta.env.VITE_AWS_BUCKET_URL}${image.path}`}
                                    alt="disease"
                                    loading="lazy"
                                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center">
                                    <ImageIcon className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </Modal>
    );
}
