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
  onChange?: (value?: string) => void;
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
  const hasError = !!errors?.[name];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: hasError ? "#dc2626" : base.borderColor,
      boxShadow: hasError ? "0 0 0 2px rgba(220, 38, 38, 0.5)" : base.boxShadow,
      "&:hover": {
        borderColor: hasError ? "#dc2626" : "#6366f1",
      },
    }),
  };

  return (
    <div className="mb-4">
      <label
        className='text-xs md:text-lg font-bold uppercase block mb-1 text-gray-700'
        htmlFor={id}
      >
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
              field.onChange(selected?.value);
              onChange?.(selected?.value);
            }}
            value={options.find((option) => option.value === field.value)}
            styles={customStyles}
            className="react-select-container text-xs xl:text-base"
            classNamePrefix="react-select"
          />
        )}
      />

      {hasError && (
        <span className="text-red-600 text-sm mt-2 block">{children}</span>
      )}
    </div>
  );
};

export default InputSelectSearchComponent;
