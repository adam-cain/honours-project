"use client";
import { signIn } from "next-auth/react";
import { validatePassword, validateEmail } from "@/lib/validation";
import AuthForm from "@/components/Auth/auth-form";

export default function LoginPage() {

    const login = async (formData: any): Promise<string> => {
        console.log(formData);
        const result = await signIn<'credentials'>('credentials', {
            redirect: true,
            email: formData.email,
            password: formData.password,
            callbackUrl: "/",
        })
        console.log(result);
        return ""
    }

    return (<AuthForm 
    title={"Login"} 
    fields={[
        {
            name: "email",
            type: "text",
            label: "Email",
            validator: (e) => validateEmail(e) ? "" : "Enter a valid email address."
        },
        {
            name: "password",
            type: "password",
            label: "Password",
            validator: (e) => validatePassword(e).errorMessage
        }
    ]} 
    onSubmit={login} 
    alternateLink={{
        href: "/signup",
        text: <>Dont Have an Account? <span className="underline underline-offset-2">Signup</span></>
    }} />)
}