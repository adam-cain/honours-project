// BaseNode.tsx
import React from 'react';
import { useEditor } from '../editor-provider';
import { EditorCanvasCardType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNodeId } from 'reactflow';
import { Badge } from '@/components/ui/badge';

interface BaseNodeProps {
    data: EditorCanvasCardType;
    children?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ data, children }) => {
    const { state, dispatch } = useEditor();
    const nodeId = useNodeId();

    return (
        <Card
            onClick={(e) => {
                e.stopPropagation();
                dispatch({
                    type: 'SELECTED_ELEMENT',
                    payload: {
                        nodeId: nodeId as string,
                    },
                });
            }}
            className={`${state.editor.selectedNode.id === nodeId && "border-white"} relative w-[250px] dark:border-muted-foreground/70`}
        >
            <CardHeader className="flex flex-row items-center gap-4 pb-1">
                <div className='flex-col flex gap-y-1'>
                    <CardTitle className="text-md">{data.title}</CardTitle>
                    <CardDescription>
                        <p className="text-xs text-muted-foreground/50">
                            <b className="text-muted-foreground/80">ID: </b>{nodeId}
                        </p>
                        <p>{data.description}</p>
                    </CardDescription>
                </div>
            </CardHeader>
            <Badge
                variant="secondary"
                className="absolute right-2 top-2"
            >
                {data.type}
            </Badge>
            <CardContent className='p-0 mt-1 gap-y-1 flex flex-col'>
                {children}
            </CardContent>
        </Card>
    );
};

export default BaseNode;
