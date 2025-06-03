import { Outlet } from "react-router-dom";

export default function DocumentLayout() {
  return (
    <main className="p-10 print:p-0 print:bg-white print:text-black">
      <div className="print:overflow-visible print:shadow-none print:ring-0">
        <Outlet />
      </div>
    </main>
  );
}
