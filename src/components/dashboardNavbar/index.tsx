"use client"
import React, { useState, useMemo, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname,useParams } from 'next/navigation';
import { HomeIcon, SettingsIcon, BotIcon, LineChartIcon, UserIcon, LucideArrowLeft, LucideArrowRight } from 'lucide-react';

// Custom components and types
import Profile from './profile-button';
import NavItem from './nav-item';
import BackButton from './back-button';
import { User } from '@/lib/types';

export interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
}

export interface BackButtonConfig {
    title: string;
    href: string;
    dynamic: boolean;
}

interface NavBarGroup {
    navItems: NavItem[];
    showOn: RegExp | RegExp[];
    dynamic: boolean;
    backButtonConfig?: BackButtonConfig;
}

export interface NavConfig {
    navGroup: NavBarGroup[];
}

const navConfig: NavConfig = {
    navGroup: [
        {
            navItems: [
                { title: 'Home', href: '/', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'Settings', href: '/profile/settings', icon: <SettingsIcon className="h-4 w-4" />, },
            ],
            showOn: [/\/[^\/]*/, /\/profile\/.*/],
            dynamic: false
        },
        {
            navItems: [
                { title: 'Overview', href: '/organisation/[org]', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'Chatbots', href: '/organisation/[org]/chat', icon: <BotIcon className="h-4 w-4" />, },
                { title: 'Analytics', href: '/organisation/[org]/analytics', icon: <LineChartIcon className="h-4 w-4" />, },
                { title: 'Members', href: '/organisation/[org]/members', icon: <UserIcon className="h-4 w-4" />, },
                { title: 'Settings', href: '/organisation/[org]/settings', icon: <SettingsIcon className="h-4 w-4" />, },
            ],
            showOn: /\/organisation\/.*/,
            dynamic: true,
            backButtonConfig: { title: 'Home', href: '/', dynamic: false}
        },
        {
            navItems: [
                { title: 'Overview', href: '/organisation/[org]/chat/[chat]', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'Analytics', href: '/organisation/[org]/chat/[chat]/analytics', icon: <LineChartIcon className="h-4 w-4" />, },
                { title: 'Settings', href: '/organisation/[org]/chat/[chat]/settings', icon: <SettingsIcon className="h-4 w-4" />, },
            ],
            showOn: /\/organisation\/.*\/chat\/.*/,
            dynamic: true,
            backButtonConfig: { title: '[org]', href: '/organisation/[org]', dynamic: true}
        }
    ]
}

const replaceDynamicSegments = (href: string, org: string | undefined, chat: string | undefined) => {
    return href.replace(/\[org\]/g, org || "").replace(/\[chat\]/g, chat || "");
};

export default function NavBar({ userData, children }: { userData: User, children: ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [hideText, setHideText] = useState(false);
    const path = usePathname();

    const { org, chat } = useParams() as {  org?: string, chat?: string};

    const dynamicNavConfig = useMemo(() => navConfig.navGroup.filter(group => 
        Array.isArray(group.showOn) ? group.showOn.some(regex => regex.test(path)) : group.showOn.test(path)
      ).map(group => ({
        ...group,
        backButtonConfig: group.backButtonConfig && {
          ...group.backButtonConfig,
          href: replaceDynamicSegments(group.backButtonConfig.href, org, chat),
          title: replaceDynamicSegments(group.backButtonConfig.title, org, chat)
        },
        navItems: group.navItems.map(item => ({
          ...item,
          href: replaceDynamicSegments(item.href, org, chat)
        }))
      })), [path, org, chat]);

    const toggleNavbar = () => {
        if (!isNavCollapsed) {
            setIsNavCollapsed(true);
            setTimeout(() => setHideText(true), 200);
        } else {
            setIsNavCollapsed(false);
            setHideText(false);
        }
    };

    return (<>
        <div className="grid min-h-screen max-h-screen w-full overflow-hidden grid-animate" style={{ gridTemplateColumns: isNavCollapsed ? '72px 1fr' : '220px 1fr' }}>
            {/* Wrapper */}
            <div className=" border-r border-stone-700 block bg-secondary relative">
                {/* Collapse button */}
                <div onClick={toggleNavbar} className="cursor-pointer absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 size-8 border bg-secondary rounded-full flex items-center justify-center">
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
                    <div className=" mx-2 border-t border-stone-200 dark:border-stone-700" />
                    {/* Nav Links */}
                    <div className="flex-grow overflow-auto overflow-x-hidden">
                        <nav className=" flex-col gap-2 px-4 py-2 text-sm font-medium">
                            {dynamicNavConfig.map((group, groupIndex) => (
                                <div className="flex flex-col gap-1" key={groupIndex}>
                                    {
                                    group.backButtonConfig ? <BackButton backButtonConfig={group.backButtonConfig} isNavCollapsed={isNavCollapsed} hideText={hideText} /> : ""}
                                    {group.navItems.map((item, itemIndex) => (
                                        <NavItem key={itemIndex} navData={item} active={item.href === path} isNavCollapsed={isNavCollapsed} hideText={hideText} />
                                    ))}
                                </div>
                            ))}
                        </nav>
                    </div>
                    {/* Profile */}
                    <div className=" mx-2 border-t border-stone-200 dark:border-stone-700" />
                    <div className="flex">
                        <Profile isCollapsed={{ hideText, navCollapsed: isNavCollapsed }} data={userData} />
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