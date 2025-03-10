const classes: { [key: number]: string } = {
    1: 'bg-orange-500',
    2: 'bg-indigo-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-red-500'
}
export default function StatusComponent({ id, tag }: { id: number, tag: string }) {
    return (
        <span className={`button flex justify-center w-2/3 ${classes[id]} text-xs md:text-sm px-2 py-1 rounded-lg `}>
            <p>{tag}</p>
        </span>
    )
}
