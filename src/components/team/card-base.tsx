"use client";
import React from "react";

export default function CardBase({ children, onclick }: { children: React.ReactNode, onclick: () => void}) {
    return (
        <div onClick={onclick} className=" aspect-square justify-center rounded-lg border border-stone-700 shadow-sm w-full max-w-md p-6 flex flex-col items-center space-y-2 hover:scale-105 ease-in-out transition duration-100 cursor-pointer">
            {children}
        </div>
    )
}