import ChatBotPage from "@/components/ChatBot/page";
import { AI } from "@/lib/actions/ai";
export default function Page({ params }: { params: { domain: string, chat: string } }) {
    return (
        <div className="overflow-hidden max-h-screen">
            <AI>
                <ChatBotPage name={params.chat} session={null} />
            </AI>
        </div>
    )
}