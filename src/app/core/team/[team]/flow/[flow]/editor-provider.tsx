'use client'

import { EditorActions, EditorNodeType } from '@/lib/types'
import {
  Dispatch,
  createContext,
  useContext,
  useReducer,
} from 'react'

export type EditorNode = EditorNodeType

export type Editor = {
  elements: EditorNodeType[]
  edges: {
    id: string
    source: string
    target: string
  }[]
  selectedNode: EditorNodeType
}

export type HistoryState = {
  history: Editor[]
  currentIndex: number
}

export type EditorState = {
  editor: Editor
  history: HistoryState
}

const initialEditorState: EditorState['editor'] = {
  elements: [],
  selectedNode: {
    data: {
      completed: false,
      current: false,
      description: '',
      metadata: {
        eventType: 'webhook',
        parameters: []
      },
      title: '',
      type: 'Input',
    },
    id: '',
    position: { x: 0, y: 0 },
    type: 'Input',
  },
  edges: [],
}

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
}

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
}

const editorReducer = (
  state: EditorState = initialState,
  action: EditorActions
): EditorState => {
  switch (action.type) {
    case 'REDO':
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1
        const nextEditorState = { ...state.history.history[nextIndex] }
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        }
        return redoState
      }
      return state

    case 'UNDO':
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1
        const prevEditorState = { ...state.history.history[prevIndex] }
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        }
        return undoState
      }
      return state

    case 'LOAD_DATA':
      return {
        ...state,
        editor: {
          ...state.editor,
          elements: action.payload.elements || initialEditorState.elements,
          edges: action.payload.edges,
        },
      } 
    case 'SELECTED_ELEMENT':
      if (action.payload.nodeId === '') {
        return {
          ...state,
          editor: {
            ...state.editor,
            selectedNode: initialEditorState.selectedNode,
          },
        }
      }

      let val = state.editor.elements.find((n) => n.id === action.payload.nodeId)
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode: val || initialEditorState.selectedNode,
        },
      }
    case 'UPDATE_METADATA': {
      let updatedSelectedNode = null;
      const updatedElements = state.editor.elements.map((el) => {
        if (el.id === action.payload.nodeId) {
          const updatedElement = {
            ...el,
            data: {
              ...el.data,
              metadata: {
                ...el.data.metadata,
                ...action.payload.metadata,
              },
            },
          };
          if (state.editor.selectedNode.id === el.id) {
            updatedSelectedNode = updatedElement;
          }
          return updatedElement;
        }
        return el;
      });

      // Create a new editor state with the updated elements
      if (updatedSelectedNode) {
        const newEditorState = {
          ...state.editor,
          elements: updatedElements,
          selectedNode: updatedSelectedNode,
        };

        // Add this new editor state to the history
        const newHistory = [...state.history.history];
        newHistory.push(newEditorState);  // This could be managed more sophisticatedly to avoid infinite history growth

        return {
          ...state,
          editor: newEditorState,
          history: {
            ...state.history,
            history: newHistory,
            currentIndex: newHistory.length - 1,  // Update the current index to point to the latest state
          },
        };
      }
      return state;
    }
    case 'UPDATE_NODE': {
      let updatedSelectedNode = null;

      const updatedElements = state.editor.elements.map((node) => {
        if (node.id === action.payload.nodeId) {
          updatedSelectedNode = {
            ...node,
            data: {
              ...node.data,
              ...action.payload.newData,
            },
          };
          return {
            ...node,
            data: {
              ...node.data,
              ...action.payload.newData,
            },
          };
        }
        return node;
      });
    
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode: updatedSelectedNode || state.editor.selectedNode,
          elements: updatedElements as EditorNodeType[],
        },
      };
    }
    default:
      return state
  }
}

export type EditorContextData = {
  previewMode: boolean
  setPreviewMode: (previewMode: boolean) => void
}

export const EditorContext = createContext<{
  state: EditorState
  dispatch: Dispatch<EditorActions>
}>({
  state: initialState,
  dispatch: () => undefined,
})

type EditorProps = {
  children: React.ReactNode
}

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor Hook must be used within the editor Provider')
  }
  return context
}

export default EditorProvider
