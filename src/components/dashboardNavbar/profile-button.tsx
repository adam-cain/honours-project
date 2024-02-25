"use client"
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserAvatar from "./avatar";
import LogoutButton from "./logout-button";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Profile({ data, isCollapsed }: { data: User, isCollapsed: { hideText: boolean, navCollapsed: boolean } }) {
    const router = useRouter();  
      
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button className={`${isCollapsed.navCollapsed ? "" : " bg-tertiary"} w-full m-2 p-3 flex items-center justify-start space-x-3 mb-3`}  variant="ghost">
                    <UserAvatar image={data.user.image} username={data.user.name}/>
                    <p 
                    className={`whitespace-nowrap overflow-hidden text-collapse-transition 
                    ${isCollapsed.hideText ? 'hidden' : ''}`} 
                    style={{ opacity: isCollapsed.navCollapsed ? 0 : 1 }}>
                    
                    {data?.user?.name || data?.user?.username || data?.user?.email || "No Username Found"}</p>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-full bg-tertiary">
                <DropdownMenuItem onClick={() =>router.push("/profile/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
};