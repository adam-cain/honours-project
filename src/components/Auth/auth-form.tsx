import React, { useState, FormEvent } from "react";
import AuthProviderButtonGroup from "@/components/Auth/provider-login-button";
import FormSubmitButton from "@/components/Auth/form-submit-button";
import Link from "next/link";
import InputField from "@/components/Auth/input-field";
import { ValidationResult } from "@/lib/types";

interface Field {
    name: string; 
    type: string; 
    label: string; 
    validator: (value: string) => ValidationResult;
}

interface AuthFormProps {
    title: string;
    fields: Field[];
    onSubmit: (formData: any) => Promise<string>;
    alternateLink: { href: string; text: React.ReactNode };
}

export default function AuthForm({ title, fields, onSubmit, alternateLink }: AuthFormProps) {
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [credentialError, setCredentialError] = useState("");
    
    const hasError = fields.some(field => formData[`${field.name}Error`]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const errorKey = `${name}Error`;
        if(value === "") {
            setFormData((prev: object) => ({ ...prev, [name]: value, [errorKey]: "" }));
            return;
        }
        const errorMessage = fields.find(field => field.name === name)?.validator(value).errorMessage;

        setFormData((prev: object) => ({ ...prev, [name]: value, [errorKey]: errorMessage }));

        if (!hasError && credentialError) {
            setCredentialError("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        let error : string = "";
        if (hasError) {
            setCredentialError("Error in form fields");
        } else {
            error = await onSubmit(formData);
            setCredentialError(error)
        }
        setLoading(false);
    };

    return (
        <>
            <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
                {title}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
                {fields.map(field => (
                    <InputField
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        id={`${field.name}_input`}
                        label={field.label}
                        error={formData[`${field.name}Error`]}
                        onChange={handleChange}
                    />
                ))}

                <FormSubmitButton loading={loading} text={title} errorMessage={credentialError}/>
            </form>

            <div className="flex items-center justify-center mx-12 my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-stone-600 dark:text-stone-300">
                    Or
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <AuthProviderButtonGroup />

            <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-300 font-medium">
                <Link href={alternateLink.href} className="hover:text-stone-800 dark:hover:text-stone-100">
                    {alternateLink.text}
                </Link>
            </p>
        </>
    );
}
