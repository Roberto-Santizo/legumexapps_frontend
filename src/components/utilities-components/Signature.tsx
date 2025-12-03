import { Image } from '@react-pdf/renderer';

export default function Signature({ firma }: { firma: string }) {
    return (
        <Image
            src={`${import.meta.env.VITE_AWS_BUCKET_URL}${firma}`}
        />
    )
}
