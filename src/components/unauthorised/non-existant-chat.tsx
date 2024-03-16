"use client"
import { useModal } from "@/components/modal/provider";
import Base from './base'
import { FileQuestion } from "lucide-react"
import CreateChatModal from "../modal/create-chat";

export default function NonExistantChat({chat, team}: {chat: string, team: string}) {
    const modal = useModal();

    const handleClick = () => modal?.show(<CreateChatModal team={team} chat={chat} />);

    return (
        <Base>
            <FileQuestion className="w-10 h-10 mx-auto" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">
                It seems like this chat does not exist
            </h3>
            <p className="text-sm mx-auto max-w-[400px] text-center">
            Either it was deleted or it never existed. You can create {chat} below.</p>
            <div className="flex justify-center">
                <button onClick={handleClick} className=" border inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md w-full">
                    Create {chat}
                </button>
            </div>
        </Base>
    )
};