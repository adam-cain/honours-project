import { Title } from "@/components/PageComponents";
import { getSession } from "@/lib/auth";
import  UserAvatar  from "@/components/dashboardNavbar/avatar";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export default function Page({ params }: { params: { org: string, chat: string } }) {
    return (<>
        <Title>{params.chat} Preview</Title>
        <ChatWindow name={params.chat} />
    </>
    )
}

async function ChatWindow({name} : {name: string}) {
    const session = await getSession();

    return (
        <div className="border flex flex-col h-full overflow-hidden">
            <div className="h-full flex flex-col">
                <UserChat session={session} message={"Hi."} />
                <AIChat message="Hi." />
                <UserChat session={session} message={"Hi."} />
            </div>
            <div className="border mb-4 mx-8" />
            <div className="w-full pt-2 md:pt-0 border-white/20 md:border-transparent md:w-[calc(100%-.5rem)]">
                <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                    <div className="relative flex h-full flex-1 flex-col">
                        <div className="flex w-full items-center">
                            <div className="overflow-hidden flex flex-col w-full border-token-border-medium flex-grow relative border border-token-border-medium text-white rounded-2xl bg-token-main-surface-primary">
                                <textarea id="prompt-textarea" tabIndex={0} rows={1} placeholder={`Message ${name}`} className="m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 max-h-25 py-[10px] pr-10 md:py-3.5 md:pr-12  text-white pl-5 " style={{ height: '52px', overflowY: 'hidden' }}>
                                </textarea>
                                <button className="absolute bottom-1.5 right-2 rounded-lg border border-white bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 hover:bg-white md:bottom-3 md:right-3" data-testid="send-button">
                                    <span className="" data-state="closed">
                                        <ArrowUp className=" w-6 h-6"/>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

function BaseChat({profile, name , message}: {profile: React.ReactNode, name:string, message: string}) {    
    return (
<div className="max-w-full flex flex-row mx-6 my-4">
    <div className="mx-4">
        {/* <UserAvatar image={session?.user?.image} username={session?.user?.name}/>
        <UserAvatar username={"A I"}/> */}
        {profile}
    </div>
    <div className="">
        <h2 className="font-semibold" >{name}</h2>
        <p className=" text-sm text-gray-200">
            {message}
        </p>
    </div>
</div>

    )
}

function UserChat({ session, message }: { session: any, message: string }) {
    return (
        <BaseChat profile={<UserAvatar image={session?.user?.image} username={session?.user?.name} />} message={message} name={session?.user?.name || "You"}/>
    )
}

function AIChat({ message }: { message: string }) {
    return (
        <BaseChat profile={<UserAvatar username={"A I"} />} message={message} name={"AI"}/>
    )
}


