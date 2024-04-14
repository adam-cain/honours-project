import { getFlows } from "@/lib/actions/flow";
import { Flow } from "@prisma/client";
import { Title } from "@/components/PageComponents"
import NewFlowButton from "@/components/Flow/new-flow-button";
import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { NotFound } from "@/components/PageComponents"
import DeployableCard from "@/components/PageComponents/card"
import VisitFlowButton from "@/components/Flow/visit-flow-button";

export default async function Page({params}:{params:{team:string}}) {
    const { team } = params;
    const flows: Flow[] = await getFlows(team);
    return (<>
        <div className="flex flex-row justify-between">
            <Title>Your Teams Flows</Title>
            <NewFlowButton team={team} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
            {flows.length === 0 ?
                NotFound(<div className="flex flex-col text-center gap-2">
                    <Title>No Flows Found</Title>
                    <p className="flex flex-row">Click the <Plus className=" size-4 self-center" /> above to create a new flow</p>
                </div>
                ) :
                flows.map((flow, key) =>
                    <DeployableCard key={key} name={flow.name} description={flow.description}
                        button={<>
                            <VisitFlowButton teamName={team} flowName={flow.name} />
                            </>
                        }
                    />
                )}
        </Suspense >
    </>
    );
}