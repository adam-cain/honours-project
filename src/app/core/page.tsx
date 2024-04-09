import { Suspense } from "react";
import Card from "@/components/team/team-button";
import NewTeamButton from "@/components/team/new-team-button";
import { getUserTeams, getTeamInvites } from "@/lib/actions/team";
import { Title } from "@/components/PageComponents";
import { TeamCard, TeamInviteCard } from "@/components/team";
import { NotFound } from "@/components/PageComponents"
import { Plus } from "lucide-react";

export default async function Overview() {
  const teams = await getUserTeams();
  const invites = await getTeamInvites();
  console.log(invites);

  

  return (<>
    <div className=" flex justify-between">
    <Title>Your Teams</Title>
    <NewTeamButton />
    </div>
    <Suspense fallback={<div>Loading...</div>}>
    {teams.length === 0 ?
            NotFound(<div className="flex flex-col text-center gap-2">
            <Title>No Teams Found</Title>
            <p className="flex flex-row">Click the <Plus className=" size-4 self-center" /> above to create a new team</p>
            </div>
            ) :
            teams.map((team: { name: string; description: string; logo: string; }, index: number) => (
              <TeamCard key={index} name={team.name} description={team.description} imageUrl={team.logo} />
            ))}
    </Suspense>

    {invites.length !== 0 ? <>
      <Title>Team Invites</Title>
      <Suspense fallback={<div>Loading...</div>}>
        {invites.map((invite: { teamId:string, team: { name: string; description: string; logo: string; teamId: string }; }, index: number) => (
          <TeamInviteCard key={index} name={invite.team.name} description={invite.team.description} imageUrl={invite.team.logo} teamId={invite.teamId} />
        ))}
      </Suspense>
    </>
      : null}
  </>
  );
}