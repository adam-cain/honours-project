import React from 'react';
import { TeamMember } from "@prisma/client";
import Avatar from '@/components/dashboardNavbar/avatar';
import {SelectButton} from './select-button';

export const MemberRow = ({ member, hasPerm }: { member: TeamMember, hasPerm:boolean }) => {
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