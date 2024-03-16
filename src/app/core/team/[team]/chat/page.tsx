import { getTeamChats } from "@/lib/actions/team";
import { Chat } from "@prisma/client";
import { Title } from "@/components/PageComponents"
import { NewChatCard, ChatCard } from "@/components/chat";

export default async function Page({ params }: { params: { team: string } }) {
    const { team } = params;
    const chats: Chat[] = await getTeamChats(team);
    
    return (<>
        <Title>All Chats</Title>
        <NewChatCard team={team} />
        {chats.map((chat, key) => <ChatCard key={key} title={chat.name} active={chat.deployed} team={team} />)}
    </>
    )
}

// function ChatCard({ title, active, team }: { team: string, title: string, active: boolean }) {
//     "use client"
//     const router = useRouter();
//     const navigate = () => router.push(`/team/${team}/chat/${title}`);

//     return (
//         <BaseCard className="group" onClick={navigate}>
//             <div className="flex items-center">
//                 <div className={`${active ? "bg-green-500" : "bg-red-500"} mr-2 border rounded-full w-2 h-2`} />
//                 <h2 className="text-lg">{title}</h2>
//             </div>
//             <div className="group-hover:bg-white group-hover:text-black rounded-lg border p-1">
//                 <ArrowRight className="w-5 h-5" />
//             </div>
//         </BaseCard>
//     )
// }

// function NewChatCard() {
//     return (
//         <BaseCard className="group">
//             <div className="flex items-center">
//                 <div className="mr-2 w-2 h-2" />
//                 <h2 className="text-lg font-semibold">Create Chat</h2>
//             </div>
//             <div className="group-hover:bg-white group-hover:text-black rounded-lg border p-1">
//                 <Plus className="w-5 h-5" />
//             </div>
//         </BaseCard>
//     );
// }