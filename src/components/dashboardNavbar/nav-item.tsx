import Link from "next/link";
import { NavItem as NavItemType } from "./types";

export default function NavItem({ navData, active, isNavCollapsed, hideText }: { navData: NavItemType, active: boolean, isNavCollapsed: boolean, hideText: boolean }) {
    if(active) console.log(navData.title);
    return (
        <Link className={`${active ? " border border-white" : ""} 
        h-10 flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-gray-300 hover:text-gray-50 hover:bg-stone-900`} 
        href={navData.href}
        >
            <div>{navData.icon}</div>
            <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>
                {navData.title}
            </span>
        </Link>)
}