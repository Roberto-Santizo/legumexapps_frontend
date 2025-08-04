export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página no encontrada</p>
      <a
        href="/dashboard"
        className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}
