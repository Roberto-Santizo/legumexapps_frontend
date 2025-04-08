import { Image } from '@react-pdf/renderer';

export default function Signature({ firma }: { firma: string }) {
    return (
        <Image
            src={`data:image/png;base64,${firma}`}
        />
    )
}
