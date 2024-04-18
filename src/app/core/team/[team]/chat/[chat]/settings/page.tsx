import { Title } from "@/components/PageComponents";
import { getFlows } from "@/lib/actions/flow";
import { Flow } from "@prisma/client";

export default async function Page({ params }: { params: { team: string, chat: string } }) {
    const flows: Flow[] = await getFlows(params.team);
    return (<>
        <Title>{params.chat} Settings</Title>
        {flows.map(flow => (
            JSON.stringify(flow)
        ))}
    </>
    )
}