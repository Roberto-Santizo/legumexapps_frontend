export default function Error({children} : {children : React.ReactNode}) {
  return (
    <p className="text-center my-4 bg-red-600 text-white font-bold text-sm uppercase p-2">{children}</p>
  )
}
