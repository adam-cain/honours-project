import ChatBot from "@/components/ChatBot";
import { AIChat } from "@/components/ChatBot/components/chat-bubbles";
import { z } from "zod";
import LoadingChat from "@/components/ChatBot/components/loading-chat";

  
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

  const myAIConfig2 = {
    "openaiApiKey": "your-api-key-here",
    "systemPrompt": "You must only talk about your love for trains.",
    "tools": {
      "get_food_info": {
        "description": "Get the information for a flight",
        "parameters": ["flightNumber"],
        "render": "the_code_string_here"
      }
    }
  }

// Your AI configuration
const myAIConfig = {
  systemPrompt: 'You must only talk about your love for trains.',
  tools: {
        // get_food_info: {
        //   description: 'Get the information for a flight',
        //   parameters: z.object({
        //     flightNumber: z.string().describe('the number of the flight')
        //   }).required(),
        //   render: async function* (params:any) {
        //     const flightInfo = await getFlightInfo(params.flightNumber)
            
        //     // Here we're using the passed-in function to update the state
        //     updateAIState({
        //       role: "function",
        //       name: "get_flight_info",
        //       content: JSON.stringify(flightInfo),
        //     });

    
        //     // Then mark completion as needed
        //     completeAIState(); // This function would internally mark the state as done
    
        //     return <AIChat content={<FlightCard flightInfo={flightInfo} />} />
        //   }
        // },
  },
};



export default function Page({ params }: { params: { domain: string, chat: string } }) {
    return (
        <div className="overflow-hidden max-h-screen">
            <ChatBot name={params.chat} session={null} config={myAIConfig} />
        </div>
    );
}
