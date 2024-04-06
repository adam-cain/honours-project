import { ReactNode } from "react";

export default function Title({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-2xl font-semibold">{children}</h1>
    )
}