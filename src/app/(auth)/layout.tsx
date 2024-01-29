import { Metadata } from "next";
import { LayoutProps } from "@/lib/types";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
        {children}
      </div>
    </div>
  );
}