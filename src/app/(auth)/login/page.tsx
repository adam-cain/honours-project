"use client";
import LoadingDots from "@/components/icons/loading-dots";
import LoginButton from "@/components/login/login-button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { validatePassword } from "@/lib/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '', emailError: '', passwordError: '' });
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setFormData(prev => ({ ...prev, emailError: validateEmail(value) ? '' : 'Please enter a valid email address.' }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, passwordError: validatePassword(value) ? '' : 'Password must be at least 8 characters long.' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add additional validation before calling signIn
    const result = await signIn<'credentials'>('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
      callbackUrl: "/",
    });
    setLoading(false);
    // Handle result
  };

  return (
    <>
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <input type="email"
          className=" border-collapse border border-stone-200 dark:border-stone-700 rounded-md px-3 py-2 my-2 w-full focus:outline-none dark:bg-stone-800 dark:text-stone-100"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email" />

        <input type="password"
          className=" border-collapse border border-stone-200 dark:border-stone-700 rounded-md px-3 py-2 my-2 w-full focus:outline-none dark:bg-stone-800 dark:text-stone-100"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password" />

        <div>
          <div className="relative">
            <input onChange={handleChange}
              type="text" id="outlined_error" aria-describedby="outlined_error_help" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" placeholder=" " />
            <label htmlFor="outlined_error"
              className="absolute text-sm text-red-600 dark:text-red-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email</label>
          </div>
          <p
            id="outlined_error_help"
            className="mt-2 text-xs text-red-600 dark:text-red-400"
            hidden={emailErr}
          >{emailError}</p>
        </div>

        <button
          type="submit"
          onClick={() => setLoading(true)}
          disabled={loading}
          className={`${loading
            ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
            : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
            } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
        >
          {loading ? (
            <LoadingDots color="#A8A29E" />
          ) : (
            <>
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Login
              </p>
            </>
          )}
        </button>
      </form>


      <div className="flex items-center justify-center mx-12">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-stone-600 dark:text-stone-300">
          Or
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <LoginButton />
      <Link href="/signup">
        <p className="mt-3 text-center text-sm text-stone-600 dark:text-stone-300 font-medium hover:text-stone-800 dark:hover:text-stone-100">
          Dont Have an Account? <span className="underline underline-offset-2">Signup</span>
        </p>
      </Link>
    </>
  );
}