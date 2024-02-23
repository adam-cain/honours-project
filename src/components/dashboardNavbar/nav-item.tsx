import Link from "next/link";
import { NavItem } from ".";

export default function NavItem({ navData, active, isNavCollapsed, hideText }: { navData: NavItem, active: boolean, isNavCollapsed: boolean, hideText: boolean }) {
    return (
        <Link className={`${active ? "bg-tertiary" : ""} 
        h-10 flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50`} 
        href={navData.href}
        >
            <div>{navData.icon}</div>
            <span className={`whitespace-nowrap overflow-hidden text-collapse-transition ${hideText ? 'hidden' : ''}`} style={{ opacity: isNavCollapsed ? 0 : 1 }}>
                {navData.title}
            </span>
        </Link>)
}