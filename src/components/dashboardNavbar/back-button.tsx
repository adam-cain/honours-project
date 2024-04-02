"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BackButtonConfig } from "./types"
import Link from "next/link"

export default function BackButton({ backButtonConfig, isNavCollapsed, hideText }: { backButtonConfig: BackButtonConfig, isNavCollapsed: boolean, hideText: boolean }) {
    const router = useRouter();
    const active = true
    return (
        <Link className={` h-10 flex items-center gap-3 rounded-lg px-3 py-2  transition-all text-gray-300 hover:text-gray-50 hover:bg-stone-900`} href={backButtonConfig.href}>
            <div><ArrowLeft className="h-4 w-4" /></div>
            <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>
                {backButtonConfig.title}
            </span>
        </Link>
    )
}