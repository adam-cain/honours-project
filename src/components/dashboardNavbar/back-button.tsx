"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BackButtonConfig } from "./types"
import Link from "next/link"

export default function BackButton({ backButtonConfig, isNavCollapsed, hideText }: { backButtonConfig: BackButtonConfig, isNavCollapsed: boolean, hideText: boolean }) {
    const router = useRouter();
    const active = true
    return (
        <Link className={` border-2 h-10 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50`} href={backButtonConfig.href}>
            <div><ArrowLeft className="h-4 w-4" /></div>
            <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>
                {backButtonConfig.title}
            </span>
        </Link>
    )
}