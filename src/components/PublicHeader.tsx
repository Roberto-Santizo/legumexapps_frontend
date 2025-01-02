import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function PublicHeader() {
  return (
    <header className="p-5 border-b bg-white shadow">
      <div className="container mx-auto flex justify-between">
        <Logo />

        <div className="flex flex-row gap-5 items-center justify-center">
          <Link to={'/login'} >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </header>
  )
}
