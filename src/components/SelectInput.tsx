import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";

interface Option {
    label: string;
    value: string | number;
}

interface SelectInputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    options: Option[];
    required?: boolean;
}

const SelectInput = <T extends FieldValues>({
    name,
    control,
    label,
    options,
    required = false,
}: SelectInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? `${label} is required` : false,
            }}
            render={({ field, fieldState }) => (
                <FormControl
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                >
                    <InputLabel>{label}</InputLabel>

                    <Select {...field} label={label}>
                        {options.map((opt) => (
                            <MenuItem
                                key={opt.value}
                                value={opt.value}
                            >
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>

                    {fieldState.error && (
                        <FormHelperText>
                            {fieldState.error.message}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
};

export default SelectInput;