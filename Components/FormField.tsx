import React from 'react'
import { FormControl, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { Controller, FieldValues, Path, Control } from "react-hook-form"


interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
    disabled?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
}

const FormField = <T extends FieldValues>({
                                              control,
                                              name,
                                              label,
                                              placeholder,
                                              type = "text",
                                              disabled = false,
                                              inputRef
                                          }: FormFieldProps<T>) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="label">{label}</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        ref = { inputRef ?? field.ref }
                        className={`input ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        title={ disabled ? "Please fill previous fields first" : ""}
                        // For file input, value cannot be set programmatically
                        {...(type === "file" ? {
                            value: undefined,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                field.onChange(e.target.files) } : {})}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

export default FormField
