"use client";
import TeamCardBase from "./card";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface TeamProps {
    name: string;
    description: string;
    imageUrl: string;
}

export default function TeamCard({ name, description, imageUrl }: TeamProps) {
    return (
        <TeamCardBase name={name} description={description} imageUrl={imageUrl} button={VisitTeamButton(name)} />
    );
}

function VisitTeamButton(name: string) {
    const router = useRouter();
    return (
        <div className="border hover:bg-white hover:border-white hover:text-black rounded  size-10 flex my-auto">
            <ChevronRight 
            className="m-auto"
            onClick={() => router.push(`/team/${name}`)}/>
        </div>
    );
}