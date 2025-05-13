import { Controller, FieldErrors, Path, Control } from "react-hook-form";
import { MutableRefObject } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureFieldProps<T extends Record<string, any>> {
    label: string;
    name: Path<T>;
    control: Control<T>;
    canvasRef: MutableRefObject<SignatureCanvas | null>;
    errors?: FieldErrors<T>;
}

const SignatureField = <T extends Record<string, any>>({
    label,
    name,
    control,
    canvasRef,
    errors,
}: SignatureFieldProps<T>) => {
    const hasError = !!errors?.[name];

    return (
        <div className="w-full text-center">
            <label htmlFor={name} className="block text-lg font-semibold text-gray-800">
                {label}
            </label>

            <div className="rounded-md bg-white p-4 border-gray-200">
                <Controller
                    name={name}
                    control={control}
                    rules={{ required: "Asegúrese de haber firmado" }}
                    render={({ field }) => (
                        <>
                            <SignatureCanvas
                                ref={canvasRef}
                                penColor="black"
                                canvasProps={{
                                    className: `w-full h-44 rounded-md border transition-all duration-200 ${hasError
                                        ? "border-red-500 ring-2 ring-red-500"
                                        : "border-gray-300 hover:border-indigo-400"
                                        }`,
                                }}
                                onEnd={() => {
                                    if (canvasRef.current) {
                                        field.onChange(canvasRef.current.toDataURL());
                                    }
                                }}
                            />

                            <button
                                type="button"
                                className="mt-3 inline-block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors uppercase"
                                onClick={() => {
                                    canvasRef.current?.clear();
                                    field.onChange("");
                                }}
                            >
                                Limpiar firma
                            </button>
                        </>
                    )}
                />
            </div>

            {hasError && (
                <span className="text-red-600 text-sm font-medium">
                    {errors?.[name]?.message?.toString() ?? "Campo requerido"}
                </span>
            )}
        </div>
    );
};

export default SignatureField;
