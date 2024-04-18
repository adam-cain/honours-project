"use client"
import React, { useEffect, useState } from 'react';
import BaseNode from './base-node';
import { Position, useNodeId, Handle } from 'reactflow';
import { useEditor } from '../editor-provider'
import { EditorCanvasCardType } from '@/lib/types'
import {
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
    const [selectedInputType, setSelectedInputType] = useState<string>('');
    const [parameters, setParameters] = useState<any[]>([])
    const [tools, setTools] = useState<any[]>([])
    const [cronExpression, setCronExpression] = useState<string>('');
    const [cronValid, setCronValid] = useState<boolean>(true);

    const addParameter: () => void = () => {
        setParameters([...parameters, { name: '', type: 'string' }])
    }

    const removeParameter = (index: number) => {
        const newParams = [...parameters];
        newParams.splice(index, 1);
        setParameters(newParams);
    }

    const addTool: () => void = () => {
        setTools([...tools, { name: '', description: '' }])
    }

    const removeTool = (index: number) => {
        const newTools = [...tools];
        newTools.splice(index, 1);
        setParameters(newTools);
    }

    const validateCronExpression = (expression: string): boolean => {
        // Simple validation for a standard 5 field CRON expression
        const regex = /^(\*|([0-5]?[0-9]))\s+(\*|1?[0-9]|2[0-3])\s+(\*|([1-9]|[12][0-9]|3[01]))\s+(\*|([1-9]|1[0-2]))\s+(\*|[0-7])$/;
        return regex.test(expression);
    };

    const handleCronChange = (value: string) => {
        setCronExpression(value);
        setCronValid(validateCronExpression(value));
    };

    useEffect(() => {
        if (nodeId) {
            dispatch({
                type: 'UPDATE_METADATA',
                payload: {
                    nodeId: nodeId,
                    metadata: { parameters: parameters }
                },
            });
        }
    }, [parameters, nodeId,dispatch]);

    return (
        <BaseNode data={data}>
            <div className='px-4 pb-4'>
                <Select
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
                {(selectedInputType === 'webhook') && (
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
                                <div key={index} className='flex flex-row gap-2'>
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        id={`${nodeId}-${index}-output`}
                                        className='!h-3 !w-3 !bg-neutral-800'
                                        style={{
                                            top: `${189 + index * 36}px`,
                                        }}
                                        isValidConnection={(e) => { console.log("valid connec:", e); return true }}
                                    />
                                    <div className='cursor-pointer border flex aspect-square rounded-md hover:bg-red-500 hover:border-red-500 h-8'
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
                {selectedInputType === 'tool' && (
                    <div className="flex flex-col h-full">
                        <div className='flex flex-row justify-between mb-1'>
                            <CardTitle className="text-muted-foreground/80 text-sm">Tool Descriptor</CardTitle>
                            <div className='cursor-pointer border flex aspect-square rounded-md hover:text-black hover:bg-white hover:border-white'
                                onClick={addTool}
                            >
                                <Plus className='m-auto size-4' />
                            </div>
                        </div>
                        <div className='flex flex-col gap-y-1 flex-grow'>
                            {tools.map((tool, index) => (
                                <div key={index} className='flex flex-col gap-2 h-8'>
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        id={`${nodeId}-${index}-output`}
                                        className='!h-3 !w-3 !bg-neutral-800'
                                        style={{
                                            top: `${189 + index * 36}px`,
                                        }}
                                        isValidConnection={(e) => { console.log("valid connec:", e); return true }}
                                    />
                                    <div className='flex flex-row'>
                                        <div className='cursor-pointer border flex aspect-square rounded-md hover:bg-red-500 hover:border-red-500 size-6'
                                            onClick={() => removeTool(index)}
                                        >
                                            <Trash2 className='m-auto size-4' />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={tool.key}
                                            onChange={(e) => {
                                                const newTools = [...tools];
                                                newTools[index].name = e.target.value;
                                                setTools(newTools);
                                            }}
                                            className="rounded-md border px-2 py-1 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        value={tool.key}
                                        onChange={(e) => {
                                            const newTools = [...tools];
                                            newTools[index].description = e.target.value;
                                            setTools(newTools);
                                        }}
                                        className="rounded-md border px-2 py-1 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                )}
                {selectedInputType === 'cron' && (
                    <div className="flex flex-col mt-4">
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={`${nodeId}-output`}
                            className='!h-3 !w-3 !bg-neutral-800'
                            style={{
                                top: `${180}px`,
                            }}
                            isValidConnection={(e) => { console.log("valid connec:", e); return true }}
                        />
                        <input
                            type="text"
                            placeholder="(e.g., 5 * * * *)"
                            value={cronExpression}
                            onChange={(e) => handleCronChange(e.target.value)}
                            className="rounded-md border px-2 py-1 text-sm placeholder:text-stone-400 focus:outline-none border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                        />
                        {!cronValid && (
                            <p className="text-red-400 text-xs mt-2">
                                Invalid CRON expression. Please check the format.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </BaseNode>
    )
}
