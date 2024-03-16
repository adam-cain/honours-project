"use client";

import { Plus } from "lucide-react"
import { useModal } from "@/components/modal/provider";
import CreateChatModal from "@/components/modal/create-chat";
import BaseCard from "./chat-card-base";

export default function NewChatCard({team}: {team: string}) {
    const modal = useModal();
    const handleClick = () => modal?.show(<CreateChatModal team={team} />);
    return (
        <BaseCard className="group" onClick={handleClick}>
            <div className="flex items-center">
                <div className="mr-2 w-2 h-2" />
                <h2 className="text-lg font-semibold">Create Chat</h2>
            </div>
            <div className="group-hover:bg-white group-hover:text-black rounded-lg border p-1">
                <Plus className="w-5 h-5" />
            </div>
        </BaseCard>
    );
}