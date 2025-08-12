import React from 'react'
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {
    Controller,
    FieldValues,
    Path,
    Control
} from "react-hook-form"

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
                        ref={inputRef}
                        className={`input ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        title={disabled ? `Please fill previous fields first` : ""}
                        {...field}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)

export default FormField
