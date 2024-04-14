"use client";

import { toast } from "sonner";
import { createScript } from "@/lib/actions/script";
import { useRouter } from "next/navigation";
import { useModal } from "./provider";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react"
import ModalSubmitButton from "./modal-button";
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CreateScriptModal({ team, script }: { team: string, script?: string | undefined }) {
    const router = useRouter();
    const modal = useModal();

    const [data, setData] = useState({
        name: script || "",
        description: "",
        isJS: "js",
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("isJS", data.isJS);
        console.log("client formdata", formData);
        
        createScript(formData, team).then((res: any) => {
            console.log("Data in create script", data);

            if (res.error) {
                toast.error(res.error);
            } else {
                const { name } = res;
                modal?.hide();
                toast.success(`Successfully created ${name}`);
                router.push(`/team/${team}/script/${name}`);
                router.refresh();
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}
            className="w-full rounded-md bg-black md:max-w-md md:border md:shadow md:border-stone-700"
        >
            <div className="relative flex flex-col space-y-4 p-5 md:p-10">
                <div className="flex justify-between items-center">
                    <h2 className="font-cal text-2xl text-white">Create a new script</h2>
                    <button
                        className="flex justify-end"
                        onClick={() => modal?.hide()}
                        aria-label="Close"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-stone-500"
                    >
                        Name
                    </label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Name for the script"
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        maxLength={32}
                        required
                        className="w-full rounded-md border px-4 py-2 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-stone-500"
                    >
                        Description
                    </label>
                    <textarea
                        name="description"
                        placeholder="Description for the script"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        maxLength={140}
                        rows={3}
                        className="w-full rounded-md border px-4 py-2 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-stone-500"
                    >
                        Choose a language
                    </label>
                    <Select value={data.isJS} onValueChange={(e) => {
                        console.log(e);
                        setData({ ...data, isJS: e })
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Languages</SelectLabel>
                                <SelectItem value="js">Javascript</SelectItem>
                                <SelectItem value="ts">Typescript</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center justify-end rounded-b-lg border-t p-3 border-stone-700 bg-stone-800 md:px-10">
                <ModalSubmitButton>Create Script</ModalSubmitButton>
            </div>
        </form>
    );
}