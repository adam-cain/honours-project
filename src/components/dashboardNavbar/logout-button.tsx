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
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
    <p>Logout</p>
    <LogOut width={13} />
  </div>
</DropdownMenuItem>
  );
}
