import { getOrgChats } from "@/lib/actions/organisation";
import { Chat } from "@prisma/client";

export default async function Page({ params }: { params: { org: string, chat: string } }) {
    const { org, chat } = params;
    const chats: Chat[] = await getOrgChats(org);
    
    return (<>
        <h1 className="text-3xl font-bold">All Chats</h1>
        <h1>My Chat: {params.chat}</h1>
        <p>{JSON.stringify(chat)}</p>
    </>
    )
}