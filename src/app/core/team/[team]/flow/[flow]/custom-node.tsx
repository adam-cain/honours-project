import { Position, useNodeId } from 'reactflow';
import { useEditor } from './editor-provider'
import { EditorCanvasCardType } from '@/lib/types'
import { CustomHandle } from './nodes/custom-handle'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'

export default function CustomNodeComponent({ data }: { data: EditorCanvasCardType }): JSX.Element {
  const { dispatch, state } = useEditor()
  const nodeId = useNodeId()

  return (
    <>
      {data.type !== 'Input' && (
        <CustomHandle
          type="target"
          position={Position.Left}
          style={{ zIndex: 100 }}
        />
      )}
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
        className="relative w-[250px] dark:border-muted-foreground/70"
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
      </Card>
      <CustomHandle
        type="source"
        position={Position.Right}
        id="a"
      />
    </>
  )
}
