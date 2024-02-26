import { getOrgChats } from "@/lib/actions/organisation";
import { Chat } from "@prisma/client";
import { Title } from "@/components/PageComponents"
import { NewChatCard, ChatCard } from "@/components/chat";
export default async function Page({ params }: { params: { org: string } }) {
    const { org } = params;
    const chats: Chat[] = await getOrgChats(org);
    
    return (<>
        <Title>All Chats</Title>
        <NewChatCard org={org} />
        {chats.map((chat, key) => <ChatCard key={key} title={chat.name} active={chat.deployed} org={org} />)}
    </>
    )
}

// function ChatCard({ title, active, org }: { org: string, title: string, active: boolean }) {
//     "use client"
//     const router = useRouter();
//     const navigate = () => router.push(`/organisation/${org}/chat/${title}`);

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