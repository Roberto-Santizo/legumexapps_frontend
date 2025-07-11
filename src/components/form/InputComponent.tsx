import { FieldErrors, UseFormRegister, Path } from "react-hook-form";

interface InputFieldProps<T extends Record<string, any>> {
    label: string;
    id: string;
    name: Path<T>;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<T>;
    validation?: object;
    errors?: FieldErrors<T>;
    children?: React.ReactNode;
    min?: string;
}

const InputComponent = <T extends Record<string, any>>({
    label,
    id,
    name,
    placeholder = "",
    type = "text",
    register,
    validation = {},
    errors,
    children,
    min = '',
}: InputFieldProps<T>) => {
    const classes =
        "border border-gray-300 rounded-sm p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400";
    const errorClasses = "border-red-600 ring-2 ring-red-600";

    return (
        <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase text-gray-700" htmlFor={id}>
                {label}
            </label>
            <input
                min={min}
                id={id}
                type={type}
                placeholder={placeholder}
                className={`${classes} ${errors?.[name] ? errorClasses : ""}`}
                {...register(name, validation)}
            />
            {errors?.[name] && (
                <span className="text-red-600 text-sm mt-1">{children}</span>
            )}
        </div>
    );
};

export default InputComponent;
