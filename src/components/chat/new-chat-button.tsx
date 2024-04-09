"use client";

import { Plus } from "lucide-react"
import { useModal } from "@/components/modal/provider";
import CreateChatModal from "@/components/modal/create-chat";

export default function NewChatButton({team}: {team: string}) {
    const modal = useModal();
    return (
        <div
            onClick={() => modal?.show(<CreateChatModal team={team}/>)}
            className="rounded border my-auto hover:bg-white hover:border-white hover:text-black p-1">
            <Plus className="w-5 h-5" />
        </div>
    )
}