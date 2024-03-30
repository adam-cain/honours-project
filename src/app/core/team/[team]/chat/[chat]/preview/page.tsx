import { Title } from "@/components/PageComponents";
import ChatBotPage from "@/components/ChatBot/page";
import { AI } from "@/lib/actions/ai";
import { getSession } from "@/lib/auth";

export default function Page({ params }: { params: { team: string, chat: string } }) {
  const session = getSession();
  return (<>
    <Title>{params.chat} Preview</Title>
    <div className="border ">
      <AI>
        <ChatBotPage name={params.chat} session={session} />
      </AI>
    </div>
  </>
  )
}

