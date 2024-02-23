import { Title } from "@/components/PageComponents";
import { getOrgMembers } from "@/lib/actions/organisation";
import { OrganizationMember } from "@prisma/client";
import Image from 'next/image';
import { CircleEllipsisIcon } from "lucide-react";
import React from 'react';
import { MemberRow } from "./select-button";

export default async function Page({ params }: { params: { org: string } }) {

    const members: OrganizationMember[] = await getOrgMembers(params.org);

    return (<>
        <Title>Members</Title>
        <div className="">
            Way of inviting a member here
        </div>
        {/* List of Members */}
        <div className="container grid gap-4 mx-auto">
            <div className="rounded-lg border">
                <div className="grid w-full  rounded-t-lg grid-cols-[55px_1fr_120px] items-center p-4 bg-tertiary">
                    <div />
                    <div className="font-semibold">User</div>
                    <div className="font-semibold">Role</div>
                </div>
                {members.map((member: OrganizationMember, index: number) => (
                    <MemberRow key={index} member={member} />
                ))}
            </div>
        </div>
    </>)
}