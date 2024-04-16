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
            <Tabs defaultValue="actions" className="h-full">
                <TabsList className=" align-middle w-full">
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent 
                    value="actions"
                    className="flex flex-col gap-4 pr-2 overflow-y-scroll max-h-[65svh]"
                >
{Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Trigger') ||
                (nodes.length && cardType.type === 'Action')
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
            ))}                </TabsContent>
                <TabsContent value="settings">Change your password here.</TabsContent>
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