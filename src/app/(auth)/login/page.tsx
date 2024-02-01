"use client";
import { signIn } from "next-auth/react";
import { validatePassword, validateEmail } from "@/lib/validation";
import AuthForm from "@/components/Auth/auth-form";
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const login = async (formData: any): Promise<string> => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            })
            if(result?.ok) {
                router.push("/")
                return "";
            }
            return result?.error ?? "Unknown error";
        } catch (error) {
            return "Unknown error";
        }
    }

    return (<AuthForm 
    title={"Login"} 
    fields={[
        {
            name: "email",
            type: "text",
            label: "Email",
            validator: (e) => validateEmail(e)
        },
        {
            name: "password",
            type: "password",
            label: "Password",
            validator: (e) => validatePassword(e)
        }
    ]} 
    onSubmit={login} 
    alternateLink={{
        href: "/signup",
        text: <>Dont Have an Account? <span className="underline underline-offset-2">Signup</span></>
    }} />)
}