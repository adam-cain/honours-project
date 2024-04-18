"use client"
import { Position, useNodeId, Handle } from 'reactflow';
import { EditorCanvasCardType } from '@/lib/types'

import BaseNode from './base-node';

export default function OutputNode({ data }: { data: EditorCanvasCardType }): JSX.Element {
    const nodeId = useNodeId()

    return (
        <BaseNode data={data}>
            <Handle
                type="target"
                position={Position.Left}
                id={`${nodeId}-output`}
                className='!h-3 !w-3 !bg-neutral-800'
                isValidConnection={(e) => { return true }} />
                <div className='pb-4'/>
        </BaseNode>
    )
}
