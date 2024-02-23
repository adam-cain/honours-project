"use client";

import { PlusSquare } from "lucide-react"
import CardBase from '../card-base';
import { useModal } from "@/components/modal/provider";
import CreateSiteModal from "@/components/modal/create-org";

export default function NewOrgButton() {
    const modal = useModal();
    return (
        <CardBase onclick={() => modal?.show(<CreateSiteModal />)}>
            <div className="flex items-center space-x-2 flex-col space-y-2">
                <PlusSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-center">Create Organisation</h3>
        </CardBase>
    )
}