import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={'/'} className="w-28 flex items-center">
            <p className="text-3xl items-center font-bold hidden md:block text-gray-500">LegumexApps</p>
        </Link>
    )
}
