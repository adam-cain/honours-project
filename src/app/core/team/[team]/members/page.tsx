import { Title } from "@/components/PageComponents";
import { userHasAdminPerm } from "@/lib/actions/team";
import { getTeamMembers, getRequestForAccess } from "@/lib/actions/members";
import { TeamMember } from "@prisma/client";
import React from 'react';
import { MemberRow } from "@/components/members/member-row";
import { InfoIcon } from "lucide-react"
import { RequestsForAccessRow } from "./team-request";

export default async function Page({ params }: { params: { team: string } }) {

    const members: TeamMember[] = await getTeamMembers(params.team);
    const userHasAdmin = (await userHasAdminPerm(params.team, null, null));

    const requestsforAccess = await getRequestForAccess(params.team);

    return (<>
        <Title>Members</Title>

        <div className="">
            Way of inviting a member here
            <RequestsForAccessRow requestsforAccess={requestsforAccess} teamName={params.team}/>
        </div>
        {/* List of Members */}
        <div className="container grid gap-4 mx-auto">
            <div className="rounded-lg border">
                <div className="grid w-full  rounded-t-lg grid-cols-[55px_1fr_120px] items-center p-4 bg-tertiary">
                    <div />
                    <div className="font-semibold">User</div>
                    <div className="font-semibold">Role</div>
                </div>
                {members.length == 0 ? <div className=" flex text-center m-8 items-center align-middle justify-center gap-x-2">
                    <InfoIcon size={24} />
                    <p>Failed to get team members</p></div>
                    :
                    members.map((member: TeamMember, index: number) => (
                        <MemberRow key={index} member={member} hasPerm={userHasAdmin.success} />
                    ))}
            </div>
        </div>
    </>)
}