import { Metadata } from "next";
import { LayoutProps } from "@/lib/types";

export const metadata: Metadata = {
  title: "Auth",
};

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
