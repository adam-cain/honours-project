import { getFlow } from "@/lib/actions/flow";
import Flow from "./flow";

export default async function Page({ params }: { params: { team: string, flow: string }}) {
    const teamName = decodeURIComponent(params.team);
    const flowName = decodeURIComponent(params.flow);
    const flow = await getFlow(teamName, flowName);
    console.log(flow)
    return (
        <div className="overflow-hidden h-full max-h-[90vh]">
            {/* <p>{JSON.stringify(flow)}</p> */}
            <Flow />
        </div>
    );
}