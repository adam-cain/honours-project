// 'use server';

import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import { AIChat } from "@/components/ChatBot/page";
import { runCode } from "./plugin";
import { CodeBlock } from "@/components/ChatBot/components/codeBlock";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}
 
// An example of a flight card component.
function FlightCard({ flightInfo }: { flightInfo: any }) {
    return (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
  <div className="flex flex-col space-y-1.5 p-6">
    <h3 className="font-semibold whitespace-nowrap tracking-tight text-2xl">{flightInfo.flightNumber}</h3>
    <p className="text-sm text-muted-foreground">Flight Number</p>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold whitespace-nowrap tracking-tight text-lg">{flightInfo.departure}</h3>
        <p className="text-sm text-muted-foreground">Departure</p>
      </div>
      <div className="text-right">
        <h3 className="font-semibold whitespace-nowrap tracking-tight text-lg">{flightInfo.arrival}</h3>
        <p className="text-sm text-muted-foreground">Arrival</p>
      </div>
    </div>
  </div>
</div>
    );
}
 
// An example of a function that fetches flight information from an external API.
async function getFlightInfo(flightNumber: string) {
  return {
    flightNumber,
    departure: 'New York',
    arrival: 'San Francisco',
  };
}
 
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
    model: 'gpt-4-0125-preview',
    provider: openai,
    messages: [
      { role: 'system', content: 'You are a flight assistant' },
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
    tools: {
      get_flight_info: {
        description: 'Get the information for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('the number of the flight')
        }).required(),
        render: async function* ({ flightNumber }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner/>
 
          // Fetch the flight information from an external API.
          const flightInfo = await getFlightInfo(flightNumber)
 
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_flight_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(flightInfo),
            }
          ]);
 
          // Return the flight card to the client.
          return <AIChat content={<FlightCard flightInfo={flightInfo} />} />
        }
      },
      code_execution: {
        description: 'Execute javascript arrow functions',
        parameters: z.object({
          code: z.string().describe('A string representation of a JavaScript arrow function to be executed. You must follow the syntax and structure of arrow functions. The function `fetch(url: string)` can be used to fetch data from an external API. Include the return statement to return data from code execution.'),
        }).required()
        ,
        render: async function* ({ code }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner/>
          console.log("Code: ", code);
          
          // Execute the code.
          const result = await runCode(code);
 
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "code_execution",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: code + "\n\nResult: " + JSON.stringify(result),
            }
          ]);
          <CodeBlock code={code} language={""}/>
          // Return the result to the client.
          return <AIChat content={result} />
        }
      },
      // display: {
      //   description: 'Display simple information to the user using generative UI',
      //   parameters: z.object({
      //     display: z.string().describe('The content to display to the user')
      //   }).required(),
      //   render: async function* ({ flightNumber }) {
      //     // Show a spinner on the client while we wait for the response.
      //     yield <Spinner/>
 
      //     // Fetch the flight information from an external API.
      //     const flightInfo = await getFlightInfo(flightNumber)
 
      //     // Update the final AI state.
      //     aiState.done([
      //       ...aiState.get(),
      //       {
      //         role: "function",
      //         name: "get_flight_info",
      //         // Content can be any string to provide context to the LLM in the rest of the conversation.
      //         content: JSON.stringify(flightInfo),
      //       }
      //     ]);
 
      //     // Return the flight card to the client.
      //     return <AIChat content={<FlightCard flightInfo={flightInfo} />} />
      //   }
      // }
    }
  })
 
  return {
    id: Date.now(),
    display: ui
  };
}
 
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
 
// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
});