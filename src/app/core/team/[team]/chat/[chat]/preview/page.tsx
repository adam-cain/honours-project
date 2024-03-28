import { Title } from "@/components/PageComponents";
import ChatBotPage from "@/components/ChatBot/page";
import { AI } from "@/lib/actions/ai";
import { getSession } from "@/lib/auth";
import { CodeBlock } from "@/components/ChatBot/components/codeBlock";

export default function Page({ params }: { params: { team: string, chat: string } }) {
    const session = getSession();
    return (<>
        <Title>{params.chat} Preview</Title>
        {/* <CodeBlock code={`async function getFlightInfo(flightNumber: string) {
  return {
    flightNumber,
    departure: 'New York',
    arrival: 'San Francisco',
  };
}`} language={"JS"} result="21" /> */}
         <AI>
            <ChatBotPage name={params.chat} session={session} />
        </AI>
    </>
    )
}

