'use client'
import { Button } from '@/components/ui/button'
// import { useNodeConnections } from '@/providers/connections-provider'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import {
  createNodesEdges,
  publishFlow,
} from '@/lib/actions/flow'
import { toast } from 'sonner'
import { Save, UploadCloud } from 'lucide-react'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
  flowId: string
}

const FlowInstance = ({ children, edges, nodes, flowId }: Props) => {
  const pathname = usePathname()
  const [isFlow, setIsFlow] = useState([])
//   const { nodeConnection } = useNodeConnections()

  const onFlowAutomation = useCallback(async () => {
    const flow = await createNodesEdges(
        flowId,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    )

    if (flow) toast.message(flow.message)
  }, [])

  const onPublishWorkflow = useCallback(async () => {
    const response = await publishFlow(flowId, true)
    if (response) toast.message(response)
  }, [])

  const onAutomateFlow = async () => {
    const flows: any = []
    const connectedEdges = edges.map((edge) => edge.target)
    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type)
        }
      })
    })

    setIsFlow(flows)
  }

  useEffect(() => {
    onAutomateFlow()
  }, [edges])

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex justify-evenly`}>
        <Button
          onClick={onFlowAutomation}
          disabled={isFlow.length < 1}
          className='disabled:pointer-events-auto'
        >
          Save <Save className='size-4 ml-1'/>
        </Button>
        <Button
          disabled={isFlow.length < 1}
          onClick={onPublishWorkflow}
          className='disabled:pointer-events-auto'
        >
          Publish <UploadCloud className='size-4 ml-1'/>
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance
