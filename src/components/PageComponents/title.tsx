import { ReactNode } from "react";

interface TitleProps {
    children: ReactNode;
    className?: string;
}

export default function Title({ children, className }: TitleProps) {
    return (
        <h1 className={`text-2xl font-semibold ${className}`}>{children}</h1>
    );
}