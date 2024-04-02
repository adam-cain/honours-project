import UserAvatar from "@/components/Profile/avatar";
import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export function BaseChat({ profile, name, content }: { profile: React.ReactNode; name: string; content: React.ReactNode; }) {
    return (
        <div className="max-w-full flex flex-row mx-6 my-4">
            <div className="mx-4">
                {profile}
            </div>
            <div className="">
                <h2 className="font-semibold">{name}</h2>
                <p className=" text-base text-wrap text-gray-200">
                    {content}
                </p>
            </div>
        </div>
    );
}

export function UserChat({ session, content }: { session: any; content: React.ReactNode; }) {
    return (
        <BaseChat profile={<UserAvatar image={session?.user?.image} username={session?.user?.name || "You"} />} content={content} name={session?.user?.name || "You"} />
    );
}

export function AIChat({ content }: { content: React.ReactNode; }) {
    content = typeof content === "string" ? <MarkdownRenderer markdown={content} /> : content;    
    return (
        <BaseChat profile={<UserAvatar username={"A I"} />} content={content} name={"AI"} />
    );
}

