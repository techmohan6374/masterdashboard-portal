import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import TextField from "@mui/material/TextField";

interface InputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    type?: string;
    required?: boolean;
    helperText?: string;
}

const Input = <T extends FieldValues>({
    name,
    control,
    label,
    type = "text",
    required = false,
    helperText,
}: InputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? `${label} is required` : false,
            }}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label={label}
                    type={type}
                    error={!!fieldState.error}
                    helperText={
                        fieldState.error?.message || helperText
                    }
                />
            )}
        />
    );
};

export default Input;