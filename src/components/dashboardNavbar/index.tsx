"use client"
import { BotIcon, HomeIcon, LineChartIcon, LucideArrowLeft, LucideArrowRight, SettingsIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { ReactNode, useMemo, useState } from 'react';

// Custom components and types
import { User } from '@prisma/client';
import BackButton from './back-button';
import NavItem from './nav-item';
import Profile from './profile-button';
import { NavConfig } from './types';
import { LeftNavIcon, RightNavIcon } from '../icons/NavArrow';
import { Logo } from "@/components/PageComponents";
import { AudioWaveform } from 'lucide-react';

const navConfig: NavConfig = {
    navGroup: [
        {
            navItems: [
                { title: 'Home', href: '/', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'User Settings', href: '/usersettings', icon: <SettingsIcon className="h-4 w-4" />, },
            ],
            showOn: [/\/[^\/]*/, /\/profile\/.*/],
            dynamic: false
        },
        {
            navItems: [
                { title: 'Overview', href: '/team/[team]', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'Chatbots', href: '/team/[team]/chat', icon: <BotIcon className="h-4 w-4" />, },
                { title: 'Analytics', href: '/team/[team]/analytics', icon: <LineChartIcon className="h-4 w-4" />, },
                { title: 'Members', href: '/team/[team]/members', icon: <UserIcon className="h-4 w-4" />, },
                { title: 'Settings', href: '/team/[team]/settings', icon: <SettingsIcon className="h-4 w-4" />, },
            ],
            showOn: /\/team\/.*/,
            dynamic: true,
            backButtonConfig: { title: 'Home', href: '/', dynamic: false }
        },
        {
            navItems: [
                { title: 'Overview', href: '/team/[team]/chat/[chat]', icon: <HomeIcon className="h-4 w-4" /> },
                { title: 'Analytics', href: '/team/[team]/chat/[chat]/analytics', icon: <LineChartIcon className="h-4 w-4" />, },
                { title: 'Settings', href: '/team/[team]/chat/[chat]/settings', icon: <SettingsIcon className="h-4 w-4" />, },
                { title: 'Preview', href: '/team/[team]/chat/[chat]/preview', icon: <BotIcon className="h-4 w-4" />, }
            ],
            showOn: /\/team\/.*\/chat\/.*/,
            dynamic: true,
            backButtonConfig: { title: '[team]', href: '/team/[team]', dynamic: true }
        }
    ]
}

const replaceDynamicSegments = (href: string, team: string | undefined, chat: string | undefined) => {
    return href.replace(/\[team\]/g, team || "").replace(/\[chat\]/g, chat || "");
};

export default function NavBar({ userData, children }: { userData: User, children: ReactNode }) {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [hideText, setHideText] = useState(false);
    const path = usePathname();

    let { team, chat } = useParams() as { team?: string, chat?: string };
    team = decodeURIComponent(team || "");
    chat = decodeURIComponent(chat || "");

    const dynamicNavConfig = useMemo(() => navConfig.navGroup.filter(group =>
        Array.isArray(group.showOn) ? group.showOn.some(regex => regex.test(path)) : group.showOn.test(path)
    ).map(group => ({
        ...group,
        backButtonConfig: group.backButtonConfig && {
            ...group.backButtonConfig,
            href: replaceDynamicSegments(group.backButtonConfig.href, team, chat),
            title: replaceDynamicSegments(group.backButtonConfig.title, team, chat)
        },
        navItems: group.navItems.map(item => ({
            ...item,
            href: replaceDynamicSegments(item.href, team, chat)
        }))
    })), [path, team, chat]);

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
        <div className=' h-screen p-[5px]'>
            <div className="grid rounded-lg border-stone-800 border h-full w-auto overflow-hidden grid-animate" style={{ gridTemplateColumns: isNavCollapsed ? '72px 1fr' : '220px 1fr' }}>
                {/* Wrapper */}
                <div className=" border-r border-stone-800 h-full block bg-secondary relative">
                    {/* Collapse button */}
                    <div onClick={toggleNavbar} className="cursor-pointer absolute left-full top-1/2 transform -translate-y-1/2  -translate-x-[1/3] size-5 rounded-full flex items-center justify-center text-black">
                        {isNavCollapsed ? <RightNavIcon className="w-6 h-6 hover:scale-110" /> : <LeftNavIcon className="w-6 h-6 hover:scale-110" />}
                    </div>
                    {/* Side Nav */}
                    <div className="flex flex-col justify-between h-full overflow-clip">
                        {/* Top Title */}
                        <div className="flex h-[50px] overflow-hidden items-center justify-center px-6">
                            <Link className="flex items-center justify-center mx-auto  h-full gap-2 font-semibold" href="/">
                                <span className={`whitespace-nowrap text-collapse-transition ${hideText ? '' : 'hidden'}`} style={{ opacity: isNavCollapsed ? 1 : 0 }}>                            
                                    <AudioWaveform className="w-6 h-6 text-[#FFD700]" />
                                </span>
                                <Logo style={{ opacity: isNavCollapsed ? 0 : 1 }} className={`whitespace-nowrap 
                               
                                ${hideText ? 'hidden' : ''}`}  />
                            </Link>
                        </div>
                        <div className=" mx-2 border-t border-stone-700" />
                        {/* Nav Links */}
                        <div className="flex-grow overflow-auto overflow-x-hidden">
                            <nav className=" flex-col gap-2 px-4 py-2 text-sm font-medium">
                                {dynamicNavConfig.map((group, groupIndex) => (
                                    <div className="flex flex-col gap-1" key={groupIndex}>
                                        {
                                            group.backButtonConfig ?
                                                <BackButton backButtonConfig={group.backButtonConfig} isNavCollapsed={isNavCollapsed} hideText={hideText} /> :
                                                ""}

                                        {group.navItems.map((item, itemIndex) => (
                                            <NavItem key={itemIndex} navData={item} active={item.href === path} isNavCollapsed={isNavCollapsed} hideText={hideText} />
                                        ))}
                                    </div>
                                ))}
                            </nav>
                        </div>
                        {/* Profile */}
                        <div className=" mx-2 border-t border-stone-700" />
                        <div className="flex">
                            <Profile isCollapsed={{ hideText, navCollapsed: isNavCollapsed }} data={userData} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </>
    )
};