"use client"
import { ChevronRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";


export default function VisitChatButton({teamName, chatName}:{teamName: string, chatName: string}) {
    const router = useRouter();
    return (
        <div className="border hover:bg-white hover:border-white hover:text-black rounded  size-10 flex my-auto">
            <ChevronRight
                className="m-auto"
                onClick={() => router.push(`/team/${teamName}/chat/${chatName}`)} />
        </div>
    );
}
