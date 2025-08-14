import { ReactNode } from "react";

type Props = {
    label: string;
    text: string;
    child: ReactNode;
}

export default function CardInfo({ label, text, child }: Props) {
    return (
        <div className="p-6 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 bg-blue-100 rounded-full mb-3">
                {child}
            </div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{text}</p>
        </div>
    )
}
