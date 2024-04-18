"use client"
import { Position, useNodeId, Handle } from 'reactflow';
import { EditorCanvasCardType } from '@/lib/types'

import BaseNode from './base-node';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';

export default function AINode({ data }: { data: EditorCanvasCardType }): JSX.Element {
    const nodeId = useNodeId()

    return (
        <BaseNode data={data}>
            <Handle
                type="target"
                position={Position.Left}
                id={`${nodeId}-output`}
                className='!h-3 !w-3 !bg-neutral-800'
                isValidConnection={(e) => { return true }} />
            <Handle
                type="source"
                position={Position.Right}
                id={`${nodeId}-output`}
                className='!h-3 !w-3 !bg-neutral-800'
                isValidConnection={(e) => { return true }} />

            <div className='px-4 pb-4'>
                <Select>
                    <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select a Model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Models</SelectLabel>
                            <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                            <SelectItem value="gpt-4">gpt-4</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                            <SelectItem value="gpt-3.5">gpt-3.5</SelectItem>
                            <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </BaseNode>
    )
}
