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
      setFormData(prev => ({ ...prev, passwordError: validatePassword(value) }));
    }
    console.log(formData);
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




        <div className="my-2">
          <div className="relative">
            <input onChange={handleChange}
              type="text"
              name="email"
              id="email_input"
              aria-describedby="email_error_help"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white focus:outline-none focus:ring-0 
                ${formData.emailError === "" ? "" :
                  "dark:border-red-400 border-red-600 dark:focus:border-red-400 focus:border-red-600"}`}
              placeholder=""
            />
            <label htmlFor="email_input"
              className={`absolute text-sm bg-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
              ${formData.emailError === "" ? "" :
                  "text-red-600 dark:text-red-400"}`}>Email</label>
          </div>
          <p
            id="email_error_help"
            className="mt-2 text-xs text-red-600 dark:text-red-400"
          >{formData.emailError}</p>
        </div>

        <div className="my-2">
          <div className="relative">
            <input onChange={handleChange}
              type="password"
              id="password"
              name="password"
              aria-describedby="outlined_error_help"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none dark:text-white focus:outline-none focus:ring-0 
                ${formData.passwordError === "" ? "" :
                  "dark:border-red-400 border-red-600 dark:focus:border-red-400 focus:border-red-600"}`}
              placeholder=" "
            />
            <label htmlFor="password"
              className={`absolute text-sm bg-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
              ${formData.passwordError === "" ? "" :
                  "text-red-600 dark:text-red-400"}`}>Password</label>
          </div>
          <p
            id="outlined_error_help"
            className="mt-2 text-xs text-red-600 dark:text-red-400"
          >{formData.passwordError}</p>
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


      <div className="flex items-center justify-center mx-12 my-4">
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