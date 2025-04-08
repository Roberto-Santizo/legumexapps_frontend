export default function Error({children} : {children : React.ReactNode}) {
  return (
    <p className="text-xs border border-l-8 border-l-red-500 p-3.5 bg-red-200 uppercase font-bold text-red-700">{children}</p>
  )
}