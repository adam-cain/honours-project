"use client";

import { toast } from "sonner";
import { createChat } from "@/lib/actions/chat";
import { useRouter } from "next/navigation";
import { useModal } from "./provider";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react"
import ModalSubmitButton  from "./modal-button";

export default function CreateChatModal({ team, chat }: { team: string, chat?: string | undefined}) {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: chat || "",
    description: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      subdomain: prev.name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, "-"),
    }));
  }, [data.name]);

  return (
    <form
      action={async (data: FormData) =>
        createChat(data,team).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            const { name } = res;
            router.push(`/team/${team}/chat/${name}`);
            modal?.hide();
            toast.success(`Successfully created ${name}`);
            router.refresh();
          }
        })
      }
      className="w-full rounded-md bg-white dark:bg-black md:max-w-md md:border md:border-stone-200 md:shadow dark:md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
      <div className="flex justify-between items-center">
    <h2 className="font-cal text-2xl dark:text-white">Create a new chat</h2>
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
            className="text-sm font-medium text-stone-500 dark:text-stone-400"
          >
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Name for the chat"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
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
            placeholder="Description for the chat"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600 placeholder:text-stone-400 focus:border-black  focus:outline-none focus:ring-black dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700 dark:focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 md:px-10">
        <ModalSubmitButton>Create Chat</ModalSubmitButton>
      </div>
    </form>
  );
}
