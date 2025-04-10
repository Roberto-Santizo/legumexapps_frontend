import { useState } from "react";
import { FieldErrors, UseFormRegister, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps<T extends Record<string, any>> {
    label: string;
    id: string;
    name: Path<T>;
    placeholder?: string;
    register: UseFormRegister<T>;
    validation?: object;
    errors?: FieldErrors<T>;
    children?: React.ReactNode;
}

export default function InputPasswordComponent<T extends Record<string, any>>({
    label,
    id,
    name,
    placeholder = "",
    register,
    validation = {},
    errors,
    children,
}: PasswordFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const baseClasses =
        "border border-gray-300 rounded-sm p-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400 w-full";
    const errorClasses = "border-red-600 ring-2 ring-red-600";

    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-lg font-bold uppercase text-gray-700" htmlFor={id}>
                {label}
            </label>
            <div className="relative">
                <input
                    autoComplete="off"
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className={`${baseClasses} ${errors?.[name] ? errorClasses : ""}`}
                    {...register(name, validation)}
                />
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500 focus:outline-none"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {errors?.[name] && (
                <span className="text-red-600 text-sm mt-1">{children}</span>
            )}
        </div>
    );
}
