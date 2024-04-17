import { CSSProperties } from "react"
import { HandleProps, Handle } from "reactflow"
import { useEditor } from "../editor-provider"

type Props = HandleProps & { style?: CSSProperties }

export const CustomHandle = (props: Props) => {
  const { state } = useEditor()

  return (
    <Handle
      {...props}
      isValidConnection={(e) => {
        console.log(e)
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
      className="!-bottom-2 !h-4 !w-4 bg-neutral-800"
    />
  )
}