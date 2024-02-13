"use client"
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "./avatar";
import LogoutButton from "./logout-button";
import { User } from "@/lib/types";

export default function Profile({ data, isCollapsed }: { data: User, isCollapsed: { hideText: boolean, navCollapsed: boolean } }) {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button className={`${isCollapsed.navCollapsed ? " bg-none" : "bg-slate-900"} w-full m-2 p-3 flex items-center justify-start space-x-3 mb-3`}  variant="ghost">
                    <UserAvatar data={data} />
                    <p 
                    className={`whitespace-nowrap overflow-hidden text-collapse-transition 
                    ${isCollapsed.hideText ? 'hidden' : ''}`} 
                    style={{ opacity: isCollapsed.navCollapsed ? 0 : 1 }}>
                    {data?.user.name || data?.user.email || "No Username Found"}</p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full">
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
};