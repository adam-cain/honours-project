"use client";
import LoadingDots from "@/components/icons/loading-dots";
import LoginButton from "@/components/Auth/provider-login-button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { validatePassword, validateEmail } from "@/lib/validation";
import InputField from "@/components/Auth/input-field";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '', emailError: '', passwordError: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setFormData(prev => ({ ...prev, [name]: value }));
    if (value === '') {
      if (name === 'email') {
        setFormData(prev => ({ ...prev, emailError: '' }));
      } else if (name === 'password') {
        setFormData(prev => ({ ...prev, passwordError: '' }));
      }
    }
    else if (name === 'email') {
      setFormData(prev => ({ ...prev, emailError: validateEmail(value) ? '' : 'Enter a valid email address.' }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, passwordError: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.emailError !== '' || formData.passwordError !== '') return;
    console.log(formData);
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

        <InputField
          type="text"
          name="email"
          id="email_input"
          placeholder=""
          label="Email"
          error={formData.emailError}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="password"
          id="password"
          placeholder=""
          label="Password"
          error={formData.passwordError}
          onChange={handleChange}
        />

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