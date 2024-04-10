import { getTeamScripts } from "@/lib/actions/script";
import { Script } from "@prisma/client";
import { Title } from "@/components/PageComponents"
import NewScriptButton from "@/components/Script/new-script-button";
import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { NotFound } from "@/components/PageComponents"
import DeployableCard from "@/components/PageComponents/card"
import VisitScriptButton from "./visit-script-button";
import { Badge } from "@/components/ui/badge";

export default async function Page({ params }: { params: { team: string } }) {
    const { team } = params;
    const scripts: Script[] = await getTeamScripts(team);
    
    return (<>
        <div className="flex flex-row justify-between">
            <Title>Your Teams Scripts</Title>
            <NewScriptButton team={team} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
            {scripts.length === 0 ?
                NotFound(<div className="flex flex-col text-center gap-2">
                    <Title>No Scripts Found</Title>
                    <p className="flex flex-row">Click the <Plus className=" size-4 self-center" /> above to create a new script</p>
                </div>
                ) :
                scripts.map((script, key) =>
                    <DeployableCard key={key} name={script.name} description={script.description} published={script.deployed}
                        button={<>
                            <Badge variant={"outline"}
                            className={`m-2 mr-4 border-none
                             ${script.isJavascript ? " bg-yellow-300 text-black" : " bg-blue-600 text-white"}`}>
                                {script.isJavascript ? ".js" : ".ts"}</Badge>
                            <VisitScriptButton teamName={team} scriptName={script.name} />
                            </>
                        }
                    />
                )}
        </Suspense >
    </>
    )
}

