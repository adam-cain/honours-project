import React, { useState } from "react";
import { getScript } from '@/lib/actions/script';
import CodeEditor from "@/components/Script/code-editor";
import { Script } from "@prisma/client";


type Props = {
    team: string;
    script: string;
}

export default async function Page({ params }: {
    params: {
        team: string,
        script: string;
    }
}) {
    const script: Script = await getScript(params.team, params.script);
    const language = script.isJavascript ? "javascript" : "typescript";
    const defaultValue = script.rawCode || "\nexport default function main() {\n    // Write your code here\n}";
    
    return (
      <CodeEditor
            language={language}
            script={script}
            defaultValue={defaultValue} params={{
                script: params.script,
                team: params.team
            }}      />
    )
}