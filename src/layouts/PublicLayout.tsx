import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex justify-center items-center p-8 lg:p-16 w-full lg:w-1/2 bg-white flex-col">
        <Outlet />
      </div>

      <div className="bg-indigo-600 flex justify-center items-center text-center p-10 w-full lg:w-1/2">
      </div>
    </div>
  );
}
