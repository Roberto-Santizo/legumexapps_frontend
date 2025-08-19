import { useAppStore } from "@/store";
import { NavLink } from "react-router-dom";

type Props = {
    url: string;
    text: string;
    children: React.ReactNode;
};

export default function NavLinkComponent({ url, children, text }: Props) {
    const changeSidebarState = useAppStore((state) => state.changeSidebarState);

    return (
        <NavLink
            onClick={() => changeSidebarState()}
            to={url}
            className={({ isActive }) =>
                `
          group flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200
          ${isActive
                    ? "bg-indigo-600 text-white font-semibold shadow"
                    : "text-gray-300 hover:bg-[#2f2e41] hover:text-indigo-400"
                }
        `
            }
        >
            <div className="text-xl transition-colors duration-200 group-hover:text-indigo-400">
                {children}
            </div>
            <span className="text-sm transition-colors duration-200 group-hover:text-indigo-400">
                {text}
            </span>
        </NavLink>
    );
}
