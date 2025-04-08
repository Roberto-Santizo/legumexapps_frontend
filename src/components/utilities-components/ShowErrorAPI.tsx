import { BellAlertIcon } from "@heroicons/react/16/solid"

export default function ShowErrorAPI() {
  return (
    <div className="flex items-center justify-center p-4">
    <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center justify-between w-full max-w-2xl">
      <div className="flex items-center">
        <BellAlertIcon className="h-6 w-6 text-red-400 mr-4" />
        <div>
          <p className="text-red-700 font-medium">Ha ocurrido un error :(</p>
          <p className="text-red-500 text-sm mt-1">
            Por favor intenta de nuevo más tarde o contacta al administrador si el problema persiste.
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}
