"use client";
import LoginButton from "@/components/login/login-button";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";


export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        router.push('/login');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred while signing up', error);
    }
  };
  

  return (
    <>
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Sign Up
      </h1>

      <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>

      <div className=" border-2 border-r-8 mx-18"></div>

      <LoginButton />
      <Link href="/login">
        <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-300 font-medium hover:text-stone-800 dark:hover:text-stone-100">
          Have an Account? <span className="underline underline-offset-2">Login</span>
        </p>
      </Link>
    </>
  );
}
