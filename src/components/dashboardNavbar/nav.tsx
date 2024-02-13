"use client"
import { LucideArrowLeft, LucideArrowRight, BotIcon, HomeIcon, SettingsIcon } from "lucide-react"
import Profile from "./profile-button"
import { User } from "@/lib/types"
import { useState } from "react";
import Link from "next/link";
import { usePathname  } from "next/navigation";

interface NavItem {
    icon: React.ReactNode;
    title: string;
    href: string;
}

export interface NavBarStructure {
    items: NavItem[];
}

const navItems: NavItem[] = [
    { icon: <HomeIcon className="h-4 w-4" />, title: 'Home', href: '/' },
    { icon: <SettingsIcon className="h-4 w-4" />, title: 'Settings', href: '/settings' },
];

export default function NavBar({ data, children }: { data: User, children: React.ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [hideText, setHideText] = useState(false);
    const path = usePathname();

    const toggleNavbar = () => {
        if (!isNavCollapsed) {
            setIsNavCollapsed(true);
            setTimeout(() => setHideText(true), 200);
        } else {
            setIsNavCollapsed(false);
            // setTimeout(() => setHideText(false), 300);
            setHideText(false);
        }
    };

    return (<>
        <div className="grid min-h-screen max-h-screen w-full overflow-hidden grid-animate" style={{ gridTemplateColumns: isNavCollapsed ? '72px 1fr' : '220px 1fr' }}>
            {/* Wrapper */}
            <div className=" border-r bg-gray-100/40 block dark:bg-gray-800/40 relative">
                {/* Collapse button */}
                <div onClick={toggleNavbar} className="cursor-pointer absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 size-8 border bg rounded-full bg-gray-800 flex items-center justify-center">
                    {isNavCollapsed ? <LucideArrowRight className="w-6 h-6" /> : <LucideArrowLeft className="w-6 h-6" />}
                </div>
                {/* Side Nav */}
                <div className="flex flex-col justify-between h-screen overflow-clip">
                    {/* Top Title */}
                    <div className="flex h-[60px] overflow-hidden items-center px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="/">
                            <BotIcon className="h-6 w-6" />
                            <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>Platform Name</span>
                        </Link>
                    </div>
                    {/* Nav Links */}
                    <div className="flex-grow overflow-auto overflow-x-hidden">
                        <nav className=" flex-col gap-2 px-4 py-2 text-sm font-medium">
                            {navItems.map((item, index) => (
                                <Link key={index} className={`${item.href === path? "hover:text-gray-900 dark:bg-gray-800 ":""} h-10 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50`} href={item.href}>
                                    <div>{item.icon}</div>
                                    <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                    {/* Profile */}
                    <div className="flex">
                        <Profile isCollapsed={{ hideText, navCollapsed: isNavCollapsed }} data={data} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-screen">
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    </>
    )
};