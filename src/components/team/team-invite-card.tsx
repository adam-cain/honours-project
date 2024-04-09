"use client"
import { useRouter } from "next/navigation";
import TeamCardBase from "./card";
import { Check, X } from "lucide-react";
import { acceptTeamInvite, deleteTeamInvite } from "@/lib/actions/team";
interface TeamProps {
    name: string;
    description: string;
    imageUrl: string;
    teamId: string;
}

export default function TeamInviteCard({ name, description, imageUrl, teamId }: TeamProps) {
    console.log(name, description, imageUrl, teamId);
    
    return (
        <TeamCardBase name={name} description={description} imageUrl={imageUrl} button={VisitTeamButton(name, teamId)} />
    );
}
    
function VisitTeamButton(name: string, teamId: string) {
    const router = useRouter();

    const handleReject = async () => {
        await deleteTeamInvite(teamId);
        router.refresh();
    }

    const handleAccept = async () => {
        await acceptTeamInvite(teamId);
        router.push(`/team/${name}`);
    }

    return (
        <div className=" h-10 flex gap-2">
            <div className="border hover:bg-green-200 hover:border-green-200 hover:text-black rounded size-10 flex">
                <Check className="m-auto" onClick={handleAccept} />
            </div>
            <div className="border hover:bg-red-200 hover:border-red-200 hover:text-black rounded size-10 flex">
                <X className="m-auto" onClick={handleReject} />
            </div>
        </div>
    );
}

