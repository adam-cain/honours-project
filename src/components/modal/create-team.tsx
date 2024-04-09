"use client";

import { toast } from "sonner";
import { createTeam } from "@/lib/actions/team";
import { useRouter } from "next/navigation";
import { useModal } from "./provider";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react"
import ModalSubmitButton  from "./modal-button";

export default function CreateTeamModal() {
  const router = useRouter();
  const modal = useModal();

  const [data, setData] = useState({
    name: "",
    subdomain: "",
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
        createTeam(data).then((res: any) => {
          if (res.error) {
            toast.error(res.error);
          } else {
            const { name } = res;
            router.refresh();
            router.push(`/team/${name}`);
            modal?.hide();
            toast.success(`Successfully created ${name}`);
          }
        })
      }
      className="w-full rounded-md bg-black md:max-w-md md:border md:shadow md:border-stone-700"
    >
      <div className="relative flex flex-col space-y-4 p-5 md:p-10">
      <div className="flex justify-between items-center">
    <h2 className="font-cal text-2xl">Create a new Team</h2>
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
            Team Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Team Name"
            autoFocus
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            maxLength={32}
            required
            className="w-full rounded-md border  px-4 py-2 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="subdomain"
            className="text-sm font-medium text-stone-500"
          >
            Subdomain
          </label>
          <div className="flex w-full max-w-md">
            <input
              name="subdomain"
              type="text"
              placeholder="subdomain"
              value={data.subdomain}
              onChange={(e) => setData({ ...data, subdomain: e.target.value })}
              autoCapitalize="off"
              pattern="[a-zA-Z0-9\-]+" // only allow lowercase letters, numbers, and dashes
              maxLength={32}
              required
              className="w-full rounded-l-lg border  px-4 py-2 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
            />
            <div className="flex items-center rounded-r-lg border border-l-0  px-3 text-sm border-stone-600 bg-stone-800 text-stone-400">
              .{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
            </div>
          </div>
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
            placeholder="Description for the Team"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength={140}
            rows={3}
            className="w-full rounded-md border  px-4 py-2 text-sm placeholder:text-stone-400  focus:outline-none  border-stone-600 bg-black text-white placeholder-stone-700 focus:ring-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-end rounded-b-lg border-t  p-3 border-stone-700 bg-stone-800 md:px-10">
        <ModalSubmitButton>Create Team</ModalSubmitButton>
      </div>
    </form>
  );
}
