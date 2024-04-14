"use client";

import { Plus } from "lucide-react"
import { useModal } from "@/components/modal/provider";
import CreateFlowModal from "@/components/modal/create-flow";

export default function NewFlowButton({team}: {team: string}) {
    const modal = useModal();
    return (
        <div
            onClick={() => modal?.show(<CreateFlowModal team={team}/>)}
            className="rounded border my-auto hover:bg-white hover:border-white hover:text-black p-1">
            <Plus className="w-5 h-5" />
        </div>
    )
}