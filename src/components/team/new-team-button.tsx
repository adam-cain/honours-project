"use client";

import { Plus } from "lucide-react"
import CardBase from './card-base';
import { useModal } from "@/components/modal/provider";
import CreateTeamModal from "@/components/modal/create-team";

export default function NewTeamButton() {
    const modal = useModal();
    return (
        <div
            onClick={() => modal?.show(<CreateTeamModal />)}
            className="rounded border my-auto hover:bg-white hover:border-white hover:text-black p-1">
            <Plus className="w-5 h-5" />
        </div>
    )
}