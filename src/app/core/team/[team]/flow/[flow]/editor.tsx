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
import EditorSideBar from './editor-sidebar';
import { EditorCanvasDefaultCardTypes } from '@/lib/consts';
import { Redo2, Undo2 } from 'lucide-react';


import CustomNodeComponent from './custom-node';
import { InputNode, OutputNode, ScriptNode, AINode } from './nodes';


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
  }

  const handleEdgeChange = (e: EdgeChange[]) => {
    onEdgesChange(e);
  }

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      if (!reactFlowInstance) return console.error('reactFlowInstance is not defined');
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
      };
      //@ts-ignore
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]  // Added setNodes here
  );

  useEffect(() => {
    const getFlow = async () => {
      setIsFlowLoading(true);
      if (flow.nodes && flow.edges) {
        setEdges(JSON.parse(flow.edges));
        setNodes(JSON.parse(flow.nodes));
      }
      setIsFlowLoading(false);
    };
    getFlow();
  }, [flow, setEdges, setNodes]);


  const handleClickCanvas = (e: any) => {

    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        nodeId: '',
      },
    })
  }

  useEffect(() => {
    dispatch({ type: 'LOAD_DATA', payload: { edges, elements: nodes as EditorNodeType[] } });
  }, [nodes, edges]);

  const nodeTypes = useMemo(() => ({
    Script: ScriptNode,
    AI: AINode,
    Input: InputNode,
    Output: OutputNode,

    Wait: CustomNodeComponent,
    Condition: CustomNodeComponent,
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
          {/* <MiniMap
            position="bottom-right"
            className="!bg-background"
            zoomable
            pannable
          /> */}
          <Controls>
            <div className='text-black bg-white '>
              <div
                onClick={() => dispatch({ type: 'UNDO' })}
                className=' flex justify-center cursor-pointer align-middle aspect-square border-b border-[#eee] hover:bg-[#f4f4f4]'>
                <Undo2 className=' size-4 m-auto' />
              </div>
              <div
                onClick={() => dispatch({ type: 'REDO' })}
                className=' flex justify-center cursor-pointer align-middle aspect-square border-b border-[#eee] hover:bg-[#f4f4f4]'>
                <Redo2 className=' size-4 m-auto' />
              </div>
            </div>
          </Controls>
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
          <EditorSideBar nodes={nodes} />
        </FlowInstance>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}