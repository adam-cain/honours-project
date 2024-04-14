import React from "react";
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
    const defaultValue = script.rawCode || (script.isJavascript ? 
    `// default export is the entry point
// Environment variables can be accessed through as env.ENV_VAR
export default function main(name) {
    // Write your code here
    return \`Hello \${name}\`
}
` 
: 
`// default export is the entry point
// Environment variables can be accessed through as env.ENV_VAR
export default function main(name: string) {
    // Write your code here
    return \`Hello \${name}\`
}
`);

    return (
        <CodeEditor
            language={language}
            script={script}
            defaultValue={defaultValue} 
            params={params} 
        />
    )
}