import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import { AIChat } from "@/components/ChatBot/components/chat-bubbles";
// import { runCode } from "../../lib/actions/plugin/plugin";
import { CodeBlock } from "@/components/ChatBot/components/codeBlock";
import  LoadingChat from "./components/loading-chat";
import { Config, ConfigSchema } from "./type/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export function createConfiguredAI(config: Config | undefined) {
  // if (!ConfigSchema.safeParse(config).success) {
  //   throw new Error("Invalid configuration provided");
  // }

  // Modify your initial tools setup to use the config's tools
  // const tools = config.tools;

  async function submitUserMessage(userInput: string) {
    'use server';
  
    const aiState = getMutableAIState<typeof AI>();
  
    // Update the AI state with the new user message.
    aiState.update([
      ...aiState.get(),
      {
        role: 'user',
        content: userInput,
      },
    ]);
  
    // The `render()` creates a generated, streamable UI.
    const ui = render({
      model: 'gpt-4-turbo',
      provider: openai,
      messages: [
        // { role: 'system', content: config.systemPrompt },
        { role: 'system', content: "You are an AI assitant" },
        { role: 'user', content: userInput }
      ],
      // `text` is called when an AI returns a text response (as opposed to a tool call).
      // Its content is streamed from the LLM, so this function will be called
      // multiple times with `content` being incremental.
      text: ({ content, done }) => {
        // When it's the final content, mark the state as done and ready for the client to access.
        if (done) {
          aiState.done([
            ...aiState.get(),
            {
              role: "assistant",
              content
            }
          ]);
        }
        return <AIChat content={content} />
      },
      // tools: {
      //   ...tools,
      //   code_execution: {
      //     description: 'Execute javascript arrow functions',
      //     parameters: z.object({
      //       code: z.string().describe('A string representation of a JavaScript arrow function to be executed. You must follow the syntax and structure of arrow functions. The function `fetch(url: string)` can be used to fetch data from an external API. You must include the return statement to return data from code execution.'),
      //     }).required()
      //     ,
      //     render: async function* ({ code }) {
      //       // Show a spinner on the client while we wait for the response.
      //       yield <LoadingChat color="#FFF" />
      //       console.log("Code: ", code);

      //       // Execute the code.
      //       const result = await runCode(code);
  
      //       // Update the final AI state.
      //       aiState.done([
      //         ...aiState.get(),
      //         {
      //           role: "function",
      //           name: "code_execution",
      //           // Content can be any string to provide context to the LLM in the rest of the conversation.
      //           content: code + "\n\nResult: " + JSON.stringify(result),
      //         }
      //       ]);
      //       <CodeBlock code={code} language={""} />
      //       // Return the result to the client.
      //       return <AIChat content={result} />
      //     }
      //   },
      // } as {
      //   [x: string]: {
      //     description?: string;
      //     parameters: any;
      //     render: (args_0: any, ...args_1: unknown[]) => any;
      //   };
      // }
    })
  
  
    return {
      id: Date.now(),
      display: ui
    };
  }

  const AI = createAI({
    actions: {
      submitUserMessage,
    },
    initialUIState,
    initialAIState,
  });

  return AI;
}