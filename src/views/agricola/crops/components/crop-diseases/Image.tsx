import { CropDiseaseImage } from "../../types";
import { deleteCropDiseaseImage } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/core/notifications/NotificationContext";
import { useParams } from "react-router-dom";
import { XIcon } from "lucide-react";

type Props = {
    slide: { id: number, src: string };
    i: number;
    setOpen: (value: boolean) => void;
    setIndex: (value: number) => void;
};

export default function Image({ slide, i, setIndex, setOpen }: Props) {
    const notify = useNotification();
    const queryClient = useQueryClient();
    const params = useParams();
    const diseaseId = params.diseaseId!;

    const { mutate, isPending } = useMutation({
        mutationFn: deleteCropDiseaseImage,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (message) => {
            notify.success(message!);
            queryClient.invalidateQueries({ queryKey: ['getCropDiseaseImagesById', diseaseId] });
        }
    });

    const handleDeleteImage = (id: CropDiseaseImage['id']) => {
        mutate(id);
    }
    return (
        <div
            className="group relative overflow-hidden rounded-md bg-gray-100 cursor-pointer"
            onClick={() => {
                setIndex(i);
                setOpen(true);
            }}
        >
            <button
                disabled={isPending}
                type="button"
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(slide.id);
                }}
            >
                <XIcon className="w-4 h-4" />
            </button>

            <img
                src={slide.src}
                alt="disease"
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

    );
}
