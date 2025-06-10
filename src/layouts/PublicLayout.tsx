import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <main className="h-svh flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl">
        <Outlet />
      </div>
    </main>
  );
}
