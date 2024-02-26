import { Suspense } from "react";
import Card from "@/components/organisation/org-button";
import NewOrgButton from "@/components/organisation/new-org-button";
import { getUserOrganisations } from "@/lib/actions/organisation";
import {Title} from "@/components/PageComponents";

export default async function Overview() {
  const orgs = await getUserOrganisations();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Title>Home</Title>
      <div className="grid grid-cols-3 gap-4">
        {orgs.map((org: { name: string; logo: string; }, index: number) => (
          <Card key={index} name={org.name} logo={org.logo} />
        ))}
       <NewOrgButton/>
      </div>
    </Suspense>
  );
}