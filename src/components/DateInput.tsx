import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface DateInputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    required?: boolean;
    helperText?: string;
}

const DateInput = <T extends FieldValues>({
    name,
    control,
    label,
    required = false,
}: DateInputProps<T>) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: required ? `${label} is required` : false,
            }}
            render={({ field, fieldState }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={label}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) =>
                            field.onChange(
                                newValue ? newValue.format("YYYY-MM-DD") : ""
                            )
                        }
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: "small",
                                error: !!fieldState.error,
                                helperText:
                                    fieldState.error?.message,
                            },
                        }}
                    />
                </LocalizationProvider>
            )}
        />
    );
};

export default DateInput;