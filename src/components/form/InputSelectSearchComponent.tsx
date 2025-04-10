import { Controller, FieldErrors, Control, Path } from "react-hook-form";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface InputSelectSearchComponentProps<T extends Record<string, any>> {
  label: string;
  id: string;
  name: Path<T>;
  options: Option[];
  control: Control<T>;
  rules?: object;
  errors?: FieldErrors<T>;
  children?: React.ReactNode;
  onChange?: (value? : string) => void;
}

const InputSelectSearchComponent = <T extends Record<string, any>>({
  label,
  id,
  name,
  options,
  control,
  rules = {},
  errors,
  children,
  onChange,
}: InputSelectSearchComponentProps<T>) => {
  const classes =
    "rounded-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out hover:border-indigo-400";
  const errorClasses = "border border-red-600 ring-2 ring-red-600 p-3";

  return (
    <div className={`${classes} ${errors?.[name] ? errorClasses : ""}`}>
      <label className="text-lg font-bold uppercase text-gray-700" htmlFor={id}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            id={id}
            options={options}
            placeholder="--SELECCIONE UNA OPCIÓN--"
            onChange={(selected) => {
              field.onChange(selected?.value)
              onChange?.(selected?.value);
            }}
            value={options.find((option) => option.value === field.value)}
          />
        )}
      />
      {errors?.[name] && (
        <span className="text-red-600 text-sm mt-2">{children}</span>
      )}
    </div>
  );
};

export default InputSelectSearchComponent;
