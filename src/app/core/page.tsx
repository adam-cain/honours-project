import { Suspense } from "react";
import Card from "@/components/team/team-button";
import NewTeamButton from "@/components/team/new-team-button";
import { getUserTeams } from "@/lib/actions/team";
import {Title} from "@/components/PageComponents";

export default async function Overview() {
  const teams = await getUserTeams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Title>Home</Title>
      <div className="grid grid-cols-3 gap-4">
        {teams.map((team: { name: string; logo: string; }, index: number) => (
          <Card key={index} name={team.name} logo={team.logo} />
        ))}
       <NewTeamButton/>
      </div>
    </Suspense>
  );
}