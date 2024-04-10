"use client";

import { Plus } from "lucide-react"
import { useModal } from "@/components/modal/provider";
import CreateScriptModal from "@/components/modal/create-script";

export default function NewScriptButton({team}: {team: string}) {
    const modal = useModal();
    return (
        <div
            onClick={() => modal?.show(<CreateScriptModal team={team}/>)}
            className="rounded border my-auto hover:bg-white hover:border-white hover:text-black p-1">
            <Plus className="w-5 h-5" />
        </div>
    )
}