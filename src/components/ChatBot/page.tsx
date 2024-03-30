'use client'
import { ArrowRight } from "lucide-react";
import React, { useState, useRef } from 'react';
import { useUIState, useActions } from "ai/rsc";
import { AI } from '@/lib/actions/ai';
import AutoResizeTextArea from "./components/resizeable-text-area";
import { UserChat } from "./components/chat-bubbles";

export default function Page({ name, session }: { name: string; session: any }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions<typeof AI>();
    const textAreaRef = useRef<{ resetSize: () => void }>(null);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow overflow-y-auto">
                <div className="size-full lg:mx-auto lg:max-w-3xl xl:max-w-3xl mx-auto flex-grow">
                    {messages.length === 0 ? <div className="flex justify-center items-center h-full">No messages yet</div> :

                        messages.map((message) => (
                            <div key={message.id}>{message.display}</div>
                        ))}
                </div>
            </div>
            <div className="w-full lg:mx-auto lg:max-w-3xl xl:max-w-3xl mx-auto my-2">
                <form className="flex bg-white text-black flex-row border rounded-lg p-3 gap-1"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setMessages((currentMessages) => [
                            ...currentMessages,
                            {
                                id: Date.now(),
                                display: <UserChat session={session} content={inputValue} />,
                            },
                        ]);

                        const responseMessage = await submitUserMessage(inputValue);
                        setMessages((currentMessages) => [
                            ...currentMessages,
                            responseMessage,
                        ]);

                        setInputValue('');
                        if (textAreaRef.current) {
                            textAreaRef.current.resetSize();
                        }
                    }}
                >

                    <AutoResizeTextArea
                        ref={textAreaRef}
                        value={inputValue}
                        placeholder="Type a message..."
                        onChange={(event) => setInputValue(event.target.value)}
                    />
                    <button className="rounded-md">
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>

        </div>
    );
}
