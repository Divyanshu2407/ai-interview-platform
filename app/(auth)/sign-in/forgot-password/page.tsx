"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/Firebase/client";
import { Button } from "@/Components/ui/button";
import FormField from "@/Components/FormField";

export default function ForgotPasswordPage() {
    const form = useForm<{ email: string }>({
        defaultValues: { email: "" },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSubmit = async ({ email }: { email: string }) => {
        try {
            setLoading(true);
            setError(null);
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-sm mx-auto p-6 space-y-6">
                <h1 className="text-2xl bg-gradient-to-r from-purple-200 to-pink-400 text-transparent bg-clip-text font-bold">Reset your password</h1>

                <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder=" type your email-id"
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && (
                    <p className="text-green-600 text-sm">
                        If that email exists, a reset link has been sent.
                    </p>
                )}

                <Button type="submit" className="w-full btn relative overflow-hidden text-black font-bold rounded-full shadow-md
                        bg-gradient-to-r from-purple-200 to-pink-400
                        transition-all duration-500 ease-in-out
                        hover:scale-105 hover:shadow-lg" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                </Button>
            </form>
        </FormProvider>
    );
}
