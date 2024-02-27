import { Title } from "@/components/PageComponents";
import { userHasAdminPerm } from "@/lib/actions/organisation";
import { getOrgMembers, getRequestForAccess } from "@/lib/actions/members";
import { OrganizationMember } from "@prisma/client";
import React from 'react';
import { MemberRow } from "@/components/members/member-row";
import { InfoIcon } from "lucide-react"
import { RequestsForAccessRow } from "./org-request";

export default async function Page({ params }: { params: { org: string } }) {

    const members: OrganizationMember[] = await getOrgMembers(params.org);


    const userHasAdmin = (await userHasAdminPerm(params.org, null, null));

    const requestsforAccess = await getRequestForAccess(params.org);

    return (<>
        <Title>Members</Title>

        <div className="">
            Way of inviting a member here
            {JSON.stringify(requestsforAccess)}
            <RequestsForAccessRow requestsforAccess={requestsforAccess} orgName={params.org}/>
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
                    <p>Failed to get organization members</p></div>
                    :
                    members.map((member: OrganizationMember, index: number) => (
                        <MemberRow key={index} member={member} hasPerm={userHasAdmin.success} />
                    ))}
            </div>
        </div>
    </>)
}