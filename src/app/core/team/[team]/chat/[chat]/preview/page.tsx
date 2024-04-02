import { Title } from "@/components/PageComponents";
import { getSession } from "@/lib/auth";
import ChatBot from "@/components/ChatBot";

const myAIConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  systemPrompt: 'You must only talk about your love for trains.',
  tools: {
    // Define your tools and their configurations here
  },
};

export default function Page({ params }: { params: { team: string, chat: string } }) {
  const session = getSession();
  return (<>
    <Title>{params.chat} Preview</Title>
    <div className="border ">
      <ChatBot name={params.chat} session={session} config={myAIConfig} />
    </div>
  </>
  )
}

