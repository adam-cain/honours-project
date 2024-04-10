import { Title } from "@/components/PageComponents";
import { userHasAdminPerm } from "@/lib/actions/team";
import { getTeamMembers } from "@/lib/actions/members";
import React from 'react';
import MembersTable from "./members-table";
import  InviteAccordian from "./invite-member";

export default async function Page({ params }: { params: { team: string } }) {

    const members = await getTeamMembers(params.team);
    const userHasAdmin = await userHasAdminPerm(params.team, null, null);
    
    return (<>
        <Title>Manage Team Members</Title>
        <InviteAccordian teamName={params.team} />
        <div>
            <Title className="text-lg mb-1">Your Team Members</Title>
            <MembersTable members={members} hasPermission={userHasAdmin.success} />
        </div>
    </>)
}