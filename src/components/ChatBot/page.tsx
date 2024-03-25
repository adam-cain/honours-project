'use client'
import UserAvatar from "@/components/dashboardNavbar/avatar";
import { ArrowRight } from "lucide-react";
import React, { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import { AI } from '@/lib/actions/ai';

export default function Page({ name, session }: { name: string; session: any }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions<typeof AI>();

    return (
        <div className="border flex flex-col h-full overflow-hidden px-6">
            {
                // View messages in UI state
                messages.map((message) => (
                    <div key={message.id}>
                        {message.display}
                    </div>
                ))
            }

            <form
                className=" fixed bottom-0 mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl align-bottom"
                onSubmit={async (e) => {
                    e.preventDefault();

                    // Add user message to UI state
                    setMessages((currentMessages) => [
                        ...currentMessages,
                        {
                            id: Date.now(),
                            display: <UserChat session={session} content={inputValue} />,
                        },
                    ]);

                    // Submit and get response message
                    const responseMessage = await submitUserMessage(inputValue);
                    setMessages((currentMessages) => [
                        ...currentMessages,
                        responseMessage,
                    ]);

                    setInputValue('');
                }}>

                <div className="relative flex h-full flex-1 flex-col">
                    <div className="flex w-full items-center">
                        <div className="overflow-hidden flex flex-col w-full border-token-border-medium flex-grow relative border border-token-border-medium text-white rounded-2xl bg-token-main-surface-primary">
                            <textarea id="prompt-textarea" tabIndex={0} rows={1} placeholder={`Message ${name}`} className="m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 max-h-25 py-[10px] pr-10 md:py-3.5 md:pr-12  text-white pl-5 overflow-visible" 
                            // style={{ height: '52px', overflowY: 'hidden' }}
                                value={inputValue}
                                onChange={(event) => {
                                    setInputValue(event.target.value)
                                }}
                            />
                            <button className="absolute bottom-1.5 right-2 rounded-lg border border-white bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 hover:bg-white md:bottom-3 md:right-3">
                                <span className="" data-state="closed">
                                    <ArrowRight className=" w-6 h-6" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

function BaseChat({ profile, name, content }: { profile: React.ReactNode, name: string, content: React.ReactNode }) {
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
                    {content}
                </p>
            </div>
        </div>

    )
}

function UserChat({ session, content }: { session: any, content: React.ReactNode }) {
    return (
        <BaseChat profile={<UserAvatar image={session?.user?.image} username={session?.user?.name} />} content={content} name={session?.user?.name || "You"} />
    )
}

export function AIChat({ content }: { content: React.ReactNode }) {
    return (
        <BaseChat profile={<UserAvatar username={"A I"} />} content={content} name={"AI"} />
    )
}
