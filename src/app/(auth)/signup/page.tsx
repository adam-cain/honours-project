"use client";
import { useRouter } from 'next/navigation';
import { validatePassword, validateEmail, validateUsername } from "@/lib/validation";
import AuthForm from "@/components/Auth/auth-form";
import { signIn } from 'next-auth/react';

export default function SignupPage() {
    const router = useRouter();

    const signup = async (formData: any): Promise<string> => {
        try {
            const result = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            
            if (result?.ok) {
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
                    router.push("/login");
                    return"Error while logging in after sign up. Please try logging in again.";
                } catch (error) {
                    return "Error while logging in after sign up. Please try logging in again.";
                }
            }else{
                return await result.json().then((data) => data.message);
            }
        } catch (error) {
            return "Unknown error: " + error;
        }
    };

    return (<AuthForm 
    title={"Signup"} 
    fields={[
        {
            name: "username",
            type: "text",
            label: "Username",
            validator: (e) => validateUsername(e)
        },
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
    onSubmit={signup} 
    alternateLink={{
        href: "/login",
        text: <>Already have an account? <span className="underline underline-offset-2">Login</span></>
    }} />);
}
