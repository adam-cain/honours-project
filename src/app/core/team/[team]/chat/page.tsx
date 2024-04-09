import { getTeamChats } from "@/lib/actions/team";
import { Chat } from "@prisma/client";
import { Title } from "@/components/PageComponents"
import { NewChatButton, ChatCard } from "@/components/chat";
import React, { Suspense } from "react";
import { Plus } from "lucide-react";
import { NotFound } from "@/components/PageComponents"

export default async function Page({ params }: { params: { team: string } }) {
    const { team } = params;
    const chats: Chat[] = await getTeamChats(team);

    return (<>
        <div className="flex flex-row justify-between">
            <Title>Your Teams Chatbots</Title>
            <NewChatButton team={team} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
        {chats.length === 0 ?
            NotFound(<div className="flex flex-col text-center gap-2">
                <Title>No Chatbots Found</Title>
                <p className="flex flex-row">Click the <Plus className=" size-4 self-center" /> above to create a new chatbot</p>
            </div>
            ) :
            chats.map((chat, key) => <ChatCard key={key} title={chat.name} active={chat.deployed} team={team} />)}
        </Suspense>
    </>
    )
}