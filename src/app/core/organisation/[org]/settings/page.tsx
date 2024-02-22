import { getOrganisation } from "@/lib/actions/organisation";

export default function Page({ params }: { params: { org: string } }) {
    const organisation = getOrganisation(params.org);
    
    return <h1>{params.org}: {JSON.stringify(organisation)}</h1>
}