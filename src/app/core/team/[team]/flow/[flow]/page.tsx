import { getFlow } from "@/lib/actions/flow";
import type { Flow as FlowType } from "@prisma/client";
import FlowEditor from "./flow-editor";

export default async function Page({ params }: { params: { team: string, flow: string } }) {
    const teamName = decodeURIComponent(params.team);
    const flowName = decodeURIComponent(params.flow);
    const flow: FlowType = await getFlow(teamName, flowName);
    return (
        <div className='h-full border rounded-lg'>
            <FlowEditor flow={flow}/>
        </div>
    )
}
