export const EditorCanvasDefaultCardTypes = { 
    Input: {
        description: 'An event that starts the workflow.',
        type: 'Input',
    },
    Output: {
        description: 'Ends the workflow and returns result inputted result.',
        type: 'Output',
    },
    Script: {
        description: 'Run a custom script using javascript or typescript.',
        type: 'Process',
    },
    AI: {
        description:'Use AI to summarize, respond, create and more.',
        type: 'Process',
    },
    Condition: {
        description: 'Boolean operator that creates different conditions lanes.',
        type: 'Process',
    },   
    Wait: {
        description: 'Delay the next action step by using the wait timer.',
        type: 'Process',
    },
}