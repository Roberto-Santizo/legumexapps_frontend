import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="h-svh flex flex-col justify-center items-center px-4">
      {/* Logo y Nombre de la Empresa */}
      <div className="flex items-center bg-white text-gray-900 px-6 py-4 rounded-2xl gap-4 transition-all duration-300">
        <img
          src="/LOGO_LX.png"
          alt="Img Logo"
          className="w-20 md:w-24 transition-transform duration-300 hover:scale-110"
        />
        <p className="text-2xl md:text-3xl font-bold tracking-wide">
          Agroindustria Legumex S.A
        </p>
      </div>

      {/* Contenedor del Login */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl mt-6">
        <Outlet />
      </div>
    </main>
  );
}
