import { Metadata } from "next";
import { LayoutProps } from "@/lib/types";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen max-w-screen flex-col justify-center py-auto sm:px-6 lg:px-8">
      <div className="mx-5 border  py-10 border-stone-700 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}