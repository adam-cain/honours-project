"use client"
import { EditorCanvasCardType, EditorCanvasTypes, EditorNodeType } from "@/lib/types"
import { useEditor } from "./editor-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorCanvasDefaultCardTypes } from "@/lib/consts"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Title } from "@/components/PageComponents"


const onDragStart = (
  event: any,
  nodeType: EditorCanvasCardType['type']
) => {
  event.dataTransfer.setData('application/reactflow', nodeType)
  event.dataTransfer.effectAllowed = 'move'
}

type Props = {
  nodes: any
}

export default function EditorSideBar({ nodes }: Props) {
  const { state } = useEditor()
  const [selectedNode, setSelectedNode] = useState<EditorNodeType>();  
  
  useEffect(() => {
    setSelectedNode(state.editor.selectedNode);
    console.log("Clicked node: ", state.editor.selectedNode.id);
  }, [state.editor.selectedNode]);

  return (
    <aside>
      <Tabs defaultValue="nodes" className="h-full">
        <TabsList className=" rounded-b-none ml-1">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <div className="w-full border-t" />
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
          {(selectedNode && selectedNode.id !== "") ? (
            <>

              <Title className=" text-sm">{selectedNode.data?.title}</Title>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {selectedNode.id}
              </p>
              <p className="text-xs">{selectedNode.data?.description}</p>
              <div className="border-t mx-2 my-1" />
              <NodeSettings selectedNode={selectedNode} />
            </>
          ) : (
            <div className="flex justify-center py-32">
              <Title className="text-lg text-center">Select a node to view its settings</Title>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function NodeSettings({ selectedNode }: { selectedNode: EditorNodeType }) {
  const renderNodeSettings = () => {
    switch (selectedNode.type) {
      case 'Input':
        return (
          <div>
            <InputNodeSettings selectedNode={selectedNode} />
          </div>
        );
      case 'Output':
        return (
          <div>
            <p>Output Node Settings</p>
          </div>
        );
      case 'Script':
        return (
          <div>
            <p>Script Node Settings</p>
          </div>
        );
      case 'Condition':
        return (
          <div>
            <p>Condition Node Settings</p>
          </div>
        );
      case 'AI':
        return (
          <div>
            <p>AI Node Settings</p>
          </div>
        );
      case 'Wait':
        return (
          <div>
            <p>Wait Node Settings</p>
          </div>
        );
      default:
        return (
          <div>
            <p>Node Settings</p>
          </div>
        );
    }
  };
  return renderNodeSettings();
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { use, useEffect, useState } from "react"

function InputNodeSettings({ selectedNode }: { selectedNode: EditorNodeType }) {
  const { dispatch } = useEditor()

  const handleTypeChange = (newEventType: "tool" | "webhook" | "cron") => {
    if (newEventType !== undefined && selectedNode.type === "Input") {
      dispatch({
        type: 'UPDATE_METADATA',
        payload: {
          nodeId: selectedNode.id,
          metadata: { eventType: newEventType }
        }
      });
    }
  }

  useEffect(() => {
    console.log("Selected node: ", selectedNode);
  })

  const renderInputNodeSettings = () => {
    if (!selectedNode.data.metadata) {
      return <div>No metadata available</div>;
    }
    if ('eventType' in selectedNode.data.metadata) {
    switch (selectedNode.data.metadata.eventType) {
      case 'webhook':
        return (
          <div>
            <p>Webhook Settings</p>
          </div>
        );
      case 'tool':
        return (
          <div>
            <p>Chat Tool Settings</p>
          </div>
        );
      case 'cron':
        return (
          <div>
            <p>CRON Job Settings</p>
          </div>
        );
    }
  }
  };

  return (
    <div className="">
      <Select
        value={selectedNode.data.metadata && 'eventType' in selectedNode.data.metadata ? selectedNode.data.metadata.eventType : ''}
        onValueChange={handleTypeChange}>
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
      {renderInputNodeSettings()}
    </div>
  );
}