"use client"
import { Handle, Position, useNodeId } from "reactflow";
import BaseNode from "./base-node";
import { EditorCanvasCardType } from '@/lib/types'
import { Badge } from "@/components/ui/badge";
import { Key, useState } from "react";
import { useModal } from "@/components/modal/provider";
import ScriptList from "@/components/modal/script-list"
import { Script } from "@prisma/client";
import { usePathname } from 'next/navigation'
import { CardTitle } from "@/components/ui/card";

export default function ScriptNode({ data }: { data: EditorCanvasCardType }): JSX.Element {
    const nodeId = useNodeId()
    const pathname = usePathname()
    const teamName = pathname.split('/')[2]
    const [selectedScript, setSelectedScript] = useState<Script | null>(null);
    const modal = useModal();

    const handleScriptSelect = (selectedScript: Script) => {
        console.log("Selected script", selectedScript);

        setSelectedScript(selectedScript);
        modal?.hide();  // Optionally close the modal after selection
        console.log(selectedScript);
    };

    return (
        <BaseNode data={data}>
            <Handle
                type="source"
                position={Position.Right}
                id={`${nodeId}-output`}
                className='!h-3 !w-3 !bg-neutral-800'
                isValidConnection={(e) => { return true }} />
            <div className='px-4 pb-4'>
                <p className='text-xs text-muted-foreground/70 pb-1'>Script</p>
                <Badge
                    onClick={(e) => {
                        e.stopPropagation();
                        modal?.show(<ScriptList team={teamName} onScriptSelect={handleScriptSelect} />)
                    }
                    }
                    className="w-full cursor-pointer" >
                    {(selectedScript && selectedScript.name) || "No script selected"}
                </Badge>
                {selectedScript &&
                    <>
                        {selectedScript.params && (
                            <>
                                <CardTitle className="text-muted-foreground/80 text-sm">Arguments</CardTitle>
                                {selectedScript.params.map((param: Script, index: number) => (
                                    <div key={index} className='flex flex-row gap-2'>
                                        <Handle
                                            type="target"
                                            position={Position.Left}
                                            id={`${nodeId}-${index}-output`}
                                            className='!h-3 !w-3 !bg-neutral-800'
                                            isValidConnection={(e) => true}
                                            style={{
                                                top: `${195 + 36 * index}px`,
                                            }}
                                        />
                                        <div className='h-8 w-full flex align-middle'>
                                            <p className='text-xs my-auto'>{param.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        {selectedScript.envVars && (
                            <>
                                <CardTitle className="text-muted-foreground/80 text-sm">Environment Variables</CardTitle>
                                {selectedScript.envVars.map((envVar: string, index: number) => (
                                    <div key={index} className='flex flex-row gap-2'>
                                        <div className='h-8 w-full flex flex-row align-middle'>
                                            <p className='text-xs my-auto mr-2'>{envVar}</p>
                                            <input
                                                type="text"
                                                placeholder={envVar}
                                                className="w-full rounded-md border px-2 py-1 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                }
            </div>
        </BaseNode>
    )
}