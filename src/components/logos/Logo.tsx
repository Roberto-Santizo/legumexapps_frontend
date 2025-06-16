import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={'/'} className="w-28 flex items-center text-center">
            <img src="/LOGO_LX.png" alt="Img Logo" />
            <p className="text-3xl items-center font-bold hidden md:block text-white">LegumexApps</p>
        </Link>
    )
}
