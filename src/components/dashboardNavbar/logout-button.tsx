"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function LogoutButton() {
  const handleClick = async () => {
    await signOut({ callbackUrl: "/"});
  };

  return (
<DropdownMenuItem onClick={handleClick}>
  <div className="flex justify-between items-center w-full">
    <p>Logout</p>
    <LogOut width={13} height={13} />
  </div>
</DropdownMenuItem>
  );
}
