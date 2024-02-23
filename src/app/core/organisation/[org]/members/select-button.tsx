"use client"

import * as Select from '@radix-ui/react-select';
import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { OrganizationMember } from "@prisma/client";
import Image from "next/image";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

function toCapitalCase(word: string) {
    word = word.toLowerCase();
    return word[0].toUpperCase() + word.slice(1);
}

export const MemberRow = ({ member }: { member: OrganizationMember }) => {
    return (
        <div className="grid w-full grid-cols-[55px_1fr_120px] items-center p-4 border-t">
            <Image className="border rounded-full aspect-square object-cover" src={"/logo.png"} alt={""} width={40} height={40} />
            <div>{member.username}</div>
            <div className="flex justify-between items-center">
                <span className="w-full">
                    <SelectButton role={member.role} />
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

const SelectButton = ({ role }: { role: string }) => {
    return (
        <Select.Root>
            <Select.Trigger
                className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px]  bg-tertiary  shadow-[0_2px_10px] shadow-black/10 hover:bg-secondary focus:shadow-[0_0_0_2px] focus:shadow-black  outline-none w-full"
                aria-label="Role Selector"
            >
                <Select.Value placeholder={toCapitalCase(role)} />
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
                            {/* <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                                Role
                            </Select.Label> */}
                            <SelectItem className='hover:bg-white' value="OWNER">Owner</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="VIEW ONLY">View only</SelectItem>
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