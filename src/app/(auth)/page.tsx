"use client";
import AuthProviderButtonGroup from "@/components/Auth/provider-login-button";
import FormSubmitButton from "@/components/Auth/form-submit-button";
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

    if (value === '') {
      setFormData(prev => ({ ...prev, [`${name}Error`]: '' }));
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, emailError: validateEmail(value) ? '' : 'Enter a valid email address.' }));
    } else if (name === 'password') {
      setFormData(prev => ({ ...prev, passwordError: validatePassword(value).errorMessage }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.emailError !== '' || formData.passwordError !== '') return;
    console.log(formData);
    setLoading(true);
    // Add additional validation before calling signIn
  
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
          label="Email"
          error={formData.emailError}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="password"
          id="password_input"
          label="Password"
          error={formData.passwordError}
          onChange={handleChange}
        />

        <FormSubmitButton loading={loading} text="Login" errorMessage={""}  />
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
        <Link href="/signup" className="hover:text-stone-800 dark:hover:text-stone-100">
          Dont Have an Account? <span className="underline underline-offset-2">Signup</span>
        </Link>
      </p>
    </>
  );
}