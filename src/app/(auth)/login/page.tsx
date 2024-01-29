"use client";
import LoginButton from "@/components/login/login-button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Call NextAuth signIn function with the 'credentials' provider
    const result = await signIn<'credentials'>('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });
    // Handle result (e.g., show error if login failed)
  };

  return (
    <>
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Login
      </h1>

      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>

      <div className=" border-2 border-r-8 mx-14"></div>
      
      <LoginButton />
      <Link href="/signup">
        <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-300 font-medium hover:text-stone-800 dark:hover:text-stone-100">
          Dont Have an Account? <span className="underline underline-offset-2">Signup</span>
        </p>
      </Link>
    </>
  );
}