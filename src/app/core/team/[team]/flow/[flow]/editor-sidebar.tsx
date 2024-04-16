import { EditorCanvasCardType, EditorCanvasTypes, EditorNodeType } from "@/lib/types"
import { useEditor } from "./editor-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorCanvasDefaultCardTypes } from "@/lib/consts"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  nodes: any
}

export default function EditorSideBar({ nodes }: Props) {
  const { state } = useEditor()
  return (
    <aside>
      <Tabs defaultValue="nodes" className="h-full">
        <TabsList className=" rounded-b-none ml-1">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="w-full border-t"/>
        <TabsContent
          value="nodes"
          className="flex flex-col gap-4 pr-2 overflow-y-scroll max-h-[65svh] h-full"
        >
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Input') ||
                (nodes.length && cardType.type === 'Process') ||
                (nodes.length && cardType.type === 'Output' && !nodes.some((node: any) => node.type === 'Output'))
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-neutral-700 bg-neutral-900"
                onDragStart={(event) =>
                  onDragStart(event, cardKey as EditorCanvasTypes)
                }
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  {/* <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} /> */}
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="test">
          Test your flow here.
        </TabsContent>
        <TabsContent value="settings">
          Change your flow settings here.
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export const onDragStart = (
  event: any,
  nodeType: EditorCanvasCardType['type']
) => {
  event.dataTransfer.setData('application/reactflow', nodeType)
  event.dataTransfer.effectAllowed = 'move'
}