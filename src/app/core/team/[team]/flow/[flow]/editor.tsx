"use client"
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEditor } from './editor-provider';
import type { Flow as FlowType } from "@prisma/client";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  EdgeChange,
  NodeChange,
  Connection,
  Edge,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { nanoid } from 'nanoid';
import FlowInstance from './flow-instance'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EditorCanvasCardType, EditorNodeType } from '@/lib/types'
import 'reactflow/dist/style.css';
import { Title } from '@/components/PageComponents';
import CustomNodeComponent from './custom-node';
import EditorSideBar from './editor-sidebar';
import {InputNode} from "./nodes"
import { EditorCanvasDefaultCardTypes } from '@/lib/consts';

// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const initialNodes: EditorNodeType[] = []

const initialEdges: { id: string; source: string; target: string }[] = []

export default function Editor(flow: FlowType) {
  flow = flow.flow
  const { dispatch, state } = useEditor()
  const [isFlowLoading, setIsFlowLoading] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>()

  const handleNodeChange = (e: NodeChange[]) => {
    onNodesChange(e);
    console.log(nodes);
  }

  const handleEdgeChange = (e: EdgeChange[]) => {
    onEdgesChange(e);
    console.log(edges);
  }

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      if (!reactFlowInstance) return console.error('reactFlowInstance is not defined')

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: {
          title: type,
          description: (EditorCanvasDefaultCardTypes as Record<string, { description: string; type: string; }>)[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      }
      //@ts-ignore
      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, state],
  );

  const getFlow = async () => {
    setIsFlowLoading(true)
    if (flow.nodes && flow.edges) {
      setEdges(JSON.parse(flow.edges))
      setNodes(JSON.parse(flow.nodes))
      setIsFlowLoading(false)
      return;
    }
    setIsFlowLoading(false)
  }

  useEffect(() => {
    getFlow()
  }, [])

  const handleClickCanvas = () => {
    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: '',
            metadata: {},
            title: '',
            type: 'Input',
          },
          id: '',
          position: { x: 0, y: 0 },
          type: 'Input',
        },
      },
    })
  }

  useEffect(() => {
    dispatch({ type: 'LOAD_DATA', payload: { edges, elements: nodes as EditorNodeType[] } })
  }, [nodes, edges])

  const nodeTypes = useMemo(() => ({
    Action: CustomNodeComponent,
    Trigger: CustomNodeComponent,
    Wait: CustomNodeComponent,
    Script: CustomNodeComponent,
    AI: CustomNodeComponent,
    Condition: CustomNodeComponent,
    Input: InputNode,
    Output: CustomNodeComponent,
  }), []);

  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70}>
        <ReactFlow
          nodes={state.editor.elements}
          edges={edges}
          snapToGrid
          onInit={setReactFlowInstance}
          onNodesChange={handleNodeChange}
          onEdgesChange={handleEdgeChange}
          onConnect={onConnect}
          onClick={handleClickCanvas}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          proOptions={
            {
              hideAttribution: true,
            }
          }
        >
          <MiniMap
            position="bottom-right"
            className="!bg-background"
            zoomable
            pannable
          />
          <Controls color='#000000'/>
          <Background
            //@ts-ignore
            variant="dots"
            gap={22}
            size={1}
          />
        </ReactFlow>
      </ResizablePanel>
      <ResizableHandle withHandle={true} className="w-1" />
      <ResizablePanel defaultSize={30} className='mx-2'>
        <div className="">

          <Title>{flow.name}</Title>
          <Title className='text-base font-light'>{flow.description}</Title>
        </div>
        <FlowInstance edges={edges} nodes={nodes} flowId={flow.id}>
          {/* <EditorSideBar nodes={nodes} /> */}
          <EditorSideBar nodes={nodes} />
        </FlowInstance>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}