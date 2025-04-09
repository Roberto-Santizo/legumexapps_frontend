import Navegation from "../Navegation";

export function Sidebar() {
  return (
    <div className="pb-12 h-screen w-64 bg-gray-100 ">
      <div className="space-y-4 py-4 max-h-screen  overflow-y-auto scrollbar-hide">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Menu
          </h2>
          <nav className="gap-2 py-2 flex flex-col w-full">
            <Navegation />
          </nav>
        </div>
      </div>
    </div>
  );
}
