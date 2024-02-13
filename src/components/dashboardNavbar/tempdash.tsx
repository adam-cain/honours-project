"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BotIcon, HomeIcon, SettingsIcon, LineChartIcon } from "@/components/icons/navIcons"
import { LayoutProps } from "@/lib/types"
import { getSession } from "@/lib/auth"
import Profile from "./profile-button"
import { LucideArrowLeft, LucideArrowRight} from "lucide-react"
import { useState } from 'react';

export async function DashboardNav({ children }: LayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const session = await getSession();

  // Function to toggle navbar state
  const toggleNavbar = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className="grid min-h-screen max-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      {/* Wrapper */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 relative">
        {/* Collapse Button */}
        <div onClick={toggleNavbar} className="absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 size-8 border bg rounded-full bg-gray-800 flex items-center justify-center">
          {/* <LucideArrowLeft className="w-6 h-6" /> */}
          {isNavCollapsed ? <LucideArrowLeft className="w-6 h-6" /> : <LucideArrowRight className="w-6 h-6" />}
        </div>

        {/* Side Nav */}
        <div className="flex flex-col justify-between h-screen">
          {/* Top Title */}
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <BotIcon className="h-6 w-6" />
              <span className="">Platform Name</span>
            </Link>
          </div>
          {/* Nav Links */}
          <div className="flex-grow overflow-auto">
            <nav className=" flex-col gap-2 grid  items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <HomeIcon className="h-4 w-4" />
                Home
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                href="#"
              >
                <BotIcon className="h-4 w-4" />
                Chatbots
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">5</Badge>
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <LineChartIcon className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
          {/* Profile */}
          <div className="flex">
            <Profile data={session} />
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}