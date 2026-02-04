type Props = {
    title: string;
    size: string;
}

export default function Title({ title, size }: Props) {
    return (
        <h1 className={`${size} font-bold`}>{title}</h1>
    )
}
