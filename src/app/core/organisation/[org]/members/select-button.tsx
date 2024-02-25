"use client"
import * as Select from '@radix-ui/react-select';
import React, { forwardRef, useState } from 'react';
import classnames from 'classnames';
import { OrganizationMember, Role } from "@prisma/client";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useParams } from 'next/navigation';
import { updateOrgMemberRole } from '@/lib/actions/organisation';
import { toast } from "sonner";
import Avatar from '@/components/dashboardNavbar/avatar';

export const MemberRow = ({ member, hasPerm }: { member: OrganizationMember, hasPerm:boolean }) => {
    
    return (
        <div className="grid w-full grid-cols-[55px_1fr_120px] items-center p-4 border-t">
            <Avatar image={member.image} username={member.username}/>
            <div>{member.username}</div>
            <div className="flex justify-between items-center">
                <span className="w-full">
                    <SelectButton member={member} hasPerm={hasPerm} />
                </span>
            </div>
        </div>
    )
}

type SelectItemProps = {
    children: React.ReactNode;
    className?: string;
    value?: string;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <Select.Item
                className={classnames(
                    'text-[13px] leading-none  rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white data-[highlighted]:text-black',
                    className
                )}
                {...props}
                ref={ref}
                value={props.value || ''}
            >
                <Select.ItemText>{children}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                    <CheckIcon />
                </Select.ItemIndicator>
            </Select.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

const roleDisplayMap: Record<Role, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    MEMBER: "Member",
    VIEW_ONLY: "View Only",
};

const SelectButton = ({ member, hasPerm }: { member: OrganizationMember, hasPerm: boolean }) => {
    const [selectedRole, setSelectedRole] = useState<Role>(member.role);
    const { org } = useParams() as { org?: string };

    const handleRoleChange = async (newDisplayValue: string) => {
        // Find the Role key that matches the newDisplayValue
        const newRole = (Object.keys(roleDisplayMap) as Role[]).find(key => roleDisplayMap[key] === newDisplayValue);

        if (newRole) {
            toast.loading("Updating role");
            if (org) {
                const formData: FormData = new FormData();
                formData.append("userId", member.userId);
                formData.append("role", newRole);
                const result = await updateOrgMemberRole(org,formData, null);
                toast.dismiss();
                if(result.error){
                    toast.error(result.error);
                }else if(result.success){
                    toast.success("Role updated successfully");
                    setSelectedRole(newRole);
                }
            } else {
                console.error("Invalid organization:", org);
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
