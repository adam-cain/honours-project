import React, { useState, useContext, useMemo } from 'react';
import { Handle, Position, NodeProps, useNodeId } from 'reactflow';
import { useEditor } from './editor-provider'
import { CSSProperties } from 'react'
import { HandleProps } from 'reactflow'
import { EditorCanvasCardType } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'


// Define a context for managing node data across the app

export default function CustomNodeComponent({ data }: { data: EditorCanvasCardType }): JSX.Element {
    const { dispatch, state } = useEditor()
    const nodeId = useNodeId()
  
    return (
      <>
        {data.type !== 'Trigger' && (
          <CustomHandle
            type="target"
            position={Position.Top}
            style={{ zIndex: 100 }}
          />
        )}
        <Card
          onClick={(e) => {
            e.stopPropagation()
            const val = state.editor.elements.find((n) => n.id === nodeId)
            if (val)
              dispatch({
                type: 'SELECTED_ELEMENT',
                payload: {
                  element: val,
                },
              })
          }}
          className="relative max-w-[400px] dark:border-muted-foreground/70"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div>
              <CardTitle className="text-md">{data.title}</CardTitle>
              <CardDescription>
                <p className="text-xs text-muted-foreground/50">
                  <b className="text-muted-foreground/80">ID: </b>
                  {nodeId}
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
          <div
            className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
              'bg-green-500': Math.random() < 0.6,
              'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
              'bg-red-500': Math.random() >= 0.8,
            })}
          ></div>
        </Card>
        <CustomHandle
          type="source"
          position={Position.Bottom}
          id="a"
        />
      </>
    )
  }
type Props = HandleProps & { style?: CSSProperties }

const selector = (s: any) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
})

const CustomHandle = (props: Props) => {
  const { state } = useEditor()

  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        const sourcesFromHandleInState = state.editor.edges.filter(
          (edge) => edge.source === e.source
        ).length
        const sourceNode = state.editor.elements.find(
          (node) => node.id === e.source
        )
        //target
        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === e.target
        ).length

        if (targetFromHandleInState === 1) return false
        if (sourceNode?.type === 'Condition') return true
        if (sourcesFromHandleInState < 1) return true
        return false
      }}
      className="!-bottom-2 !h-4 !w-4 dark:bg-neutral-800"
    />
  )
}
