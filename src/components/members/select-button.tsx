"use client"
import { updateTeamMemberRole } from "@/lib/actions/members";
import { TeamMember, Role } from "@prisma/client";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Select from '@radix-ui/react-select';
import { SelectItem } from "./select-item";

const roleDisplayMap: Record<Role, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
    VIEW_ONLY: "View Only",
};

export const SelectButton = ({ member, hasPerm }: { member: TeamMember, hasPerm: boolean }) => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(member.role);
    const { team } = useParams() as { team?: string };

    const handleRoleChange = async (newDisplayValue: string) => {
        // Find the Role key that matches the newDisplayValue
        const newRole = (Object.keys(roleDisplayMap) as Role[]).find(key => roleDisplayMap[key] === newDisplayValue);

        if (newRole) {
            toast.loading("Updating role");
            if (team) {
                const formData: FormData = new FormData();
                formData.append("userId", member.userId);
                formData.append("role", newRole);
                const result = await updateTeamMemberRole(team,formData, null);
                
                toast.dismiss();
                router.refresh();
                if(result.error){
                    toast.error(result.error);
                }else if(result.success){
                    toast.success("Role updated successfully");
                    setSelectedRole(newRole);
                }
            } else {
                console.error("Invalid team:", team);
            }
        } else {
            console.error("Invalid role selection:", newDisplayValue);
        }
    };

    return (
        <Select.Root disabled={hasPerm ? false : true} onValueChange={handleRoleChange}>
            <Select.Trigger
                className={` ${hasPerm ? "" : "cursor-not-allowed"} 
                inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px]  bg-tertiary  shadow-[0_2px_10px] shadow-black/10 hover:bg-secondary focus:shadow-[0_0_0_2px] focus:shadow-black  outline-none w-full
                `}
                aria-label="Role Selector"
            >
                <Select.Value placeholder={roleDisplayMap[selectedRole as Role]} />
                <Select.Icon className="">
                    <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="overflow-hidden bg-tertiary rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                    <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-tertiary  cursor-default">
                        <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-[5px]">
                        <Select.Group >
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="View Only">View Only</SelectItem>
                        </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-tertiary  cursor-default">
                        <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}