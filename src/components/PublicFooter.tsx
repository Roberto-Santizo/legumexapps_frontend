import { getYear } from "../helpers";

export default function PublicFooter() {
  return (
    <footer className="text-center p-8 text-gray-500 font-bold uppercase mt-10 border">
        AgroIndustria Legumex - Todos los derechos reservados {getYear()}
    </footer>
  )
}
