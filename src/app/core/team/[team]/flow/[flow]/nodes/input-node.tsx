"use client"
import React, { useEffect, useState } from 'react';
import { Position, useNodeId, Handle } from 'reactflow';
import { useEditor } from '../editor-provider'
import { EditorCanvasCardType, EditorNodeType } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from 'lucide-react';

export default function InputNode({ data }: { data: EditorCanvasCardType }): JSX.Element {
    const { dispatch, state } = useEditor()
    const nodeId = useNodeId()
    // const [selectedInputType, setSelectedInputType] = useState<string>('');
    // const [parameters, setParameters] = useState<any[]>([])

    // const addParameter = () => {
    //     setParameters([...parameters, { name: '', type: 'string' }])
    // }

    // const removeParameter = (index: number) => {
    //     const newParams = [...parameters];
    //     newParams.splice(index, 1);
    //     setParameters(newParams);
    // }

    // useEffect(() => {
    //     if (nodeId) {
    //         dispatch({
    //             type: 'UPDATE_METADATA',
    //             payload: {
    //                 nodeId: nodeId,
    //                 metadata: { parameters: parameters }
    //             },
    //         });
    //     }
    // }, [parameters, nodeId]);

    return (
        <>
            <Card
                onClick={(e) => {
                    e.stopPropagation()
                    dispatch({
                        type: 'SELECTED_ELEMENT',
                        payload: {
                            nodeId: nodeId as string,
                        },
                    })
                }}
                className={`${state.editor.selectedNode.id === nodeId && "border-white"} relative w-[250px] dark:border-muted-foreground/70`}
            >
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className='flex-col flex gap-y-1'>
                        <CardTitle className="text-md">{data.title}</CardTitle>
                        <CardDescription>
                            <p className="text-xs text-muted-foreground/50">
                                <b className="text-muted-foreground/80">ID: </b>
                                {nodeId}
                            </p>
                            <p>{data.description}</p>
                        </CardDescription>
                        <CardContent className='p-0 mt-1 gap-y-1 flex flex-col'>
                            {/* <Select
                                value={selectedInputType}
                                onValueChange={(e) => {
                                    setSelectedInputType(e);
                                }}>
                                <SelectTrigger className="w-full h-8">
                                    <SelectValue placeholder="Select an event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Input events</SelectLabel>
                                        <SelectItem value="webhook">Web Hook</SelectItem>
                                        <SelectItem value="tool">Chat Tool</SelectItem>
                                        <SelectItem value="cron">CRON Job</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {(selectedInputType === 'webhook' || selectedInputType === "tool") && (
                                <div className="flex flex-col">
                                    <div className='flex flex-row justify-between mb-1'>
                                        <CardTitle className="text-muted-foreground/80 text-sm">Parameters</CardTitle>
                                        <div className='cursor-pointer border flex aspect-square rounded-md hover:text-black hover:bg-white hover:border-white'
                                            onClick={addParameter}
                                        >
                                            <Plus className='m-auto size-4' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-y-1'>
                                        {parameters.map((param, index) => (
                                            // console.log((index/parameters.length)*100)
                                            <div key={index} className='flex flex-row gap-2 h-8'>
                                                <Handle
                                                    type="source"
                                                    position={Position.Right}
                                                    id={`${nodeId}-${index}-output`}
                                                    className='!h-3 !w-3 !bg-neutral-800'
                                                    style={{
                                                        top: `${193 + index * 36}px`,
                                                    }}
                                                    // isValidConnection={(e) => { console.log(e); return true }}
                                                />
                                                <div className='cursor-pointer border flex aspect-square rounded-md hover:bg-red-500 hover:border-red-500'
                                                    onClick={() => removeParameter(index)}
                                                >
                                                    <Trash2 className='m-auto size-4' />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    value={param.key}
                                                    onChange={(e) => {
                                                        const newParams = [...parameters];
                                                        newParams[index].name = e.target.value;
                                                        setParameters(newParams);
                                                    }}
                                                    className="w-1/2 rounded-md border px-2 py-1 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                                                />
                                                <Select
                                                    value={parameters[index].type}  
                                                    onValueChange={(e) => {
                                                        const newParams = [...parameters];
                                                        newParams[index].type = e;
                                                        setParameters(newParams);
                                                    }}>
                                                    <SelectTrigger className="w-28 h-8">
                                                        <SelectValue placeholder="Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Type</SelectLabel>
                                                            <SelectItem value="string">String</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                            <SelectItem value="object">JSON</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                </div>)}

                            {selectedInputType === 'cron' && (
                                <div className="">{selectedInputType}</div>
                            )} */}
                        </CardContent>
                    </div>
                </CardHeader>
                <Badge
                    variant="secondary"
                    className="absolute right-2 top-2"
                >
                    {data.type + " : " + JSON.stringify((state.editor.elements.filter((n) => n.id === nodeId))[0].data.metadata)}
                </Badge>
                {/* <div
                    className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
                        'bg-green-500': Math.random() < 0.6,
                        'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
                        'bg-red-500': Math.random() >= 0.8,
                    })}
                ></div> */}
            </Card>
        </>
    )
}
