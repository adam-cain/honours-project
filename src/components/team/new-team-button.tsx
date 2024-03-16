"use client";

import { PlusSquare } from "lucide-react"
import CardBase from './card-base';
import { useModal } from "@/components/modal/provider";
import CreateTeamModal from "@/components/modal/create-team";

export default function NewTeamButton() {
    const modal = useModal();
    return (
        <CardBase onclick={() => modal?.show(<CreateTeamModal />)}>
            <div className="flex items-center space-x-2 flex-col space-y-2">
                <PlusSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-center">Create Team</h3>
        </CardBase>
    )
}