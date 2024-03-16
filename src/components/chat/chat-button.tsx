"use client";

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BaseCard from './chat-card-base';

export default function ChatCard({ title, active, team }: { team: string, title: string, active: boolean }) {
    "use client"
    const router = useRouter();
    const navigate = () => router.push(`/team/${team}/chat/${title}`);

    return (
        <BaseCard className="group" onClick={navigate}>
            <div className="flex items-center">
                <div className={`${active ? "bg-green-500" : "bg-red-500"} mr-2 border rounded-full w-2 h-2`} />
                <h2 className="text-lg">{title}</h2>
            </div>
            <div className="group-hover:bg-white group-hover:text-black rounded-lg border p-1">
                <ArrowRight className="w-5 h-5" />
            </div>
        </BaseCard>
    )
}

