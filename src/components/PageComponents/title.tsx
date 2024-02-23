import { ReactNode } from "react";

export default function Title({ children }: { children: ReactNode }) {
    return (
        <h1 className="text-3xl font-bold">{children}</h1>
    )
}