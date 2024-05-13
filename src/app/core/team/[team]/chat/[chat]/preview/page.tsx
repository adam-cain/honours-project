import { Title } from "@/components/PageComponents";
import { getSession } from "@/lib/auth";
import ChatBot from "@/components/ChatBot";
import { getTeam } from "@/lib/actions/team";
import { Team } from "@prisma/client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const myAIConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  systemPrompt: 'You must only talk about your love for trains.',
  tools: {
    // Define your tools and their configurations here
  },
};

export default async function Page({ params }: { params: { team: string, chat: string } }) {
  const session = await getSession();
  const team: Team = await getTeam(params.team);
  console.log(team);
  const externalLink = `${team.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${params.chat}`;
  return (<>
    <div className="flex flex-row">
      <Title>{params.chat} Preview</Title> 
      <Link 
      href={externalLink}
      className=" ml-2 underline flex flex-row justify-center align-middle items-center text-blue-500 hover:text-blue-600 cursor-pointer"
      >
        {externalLink}
        <ExternalLink className=" ml-1 size-4 my-auto"/>
      </Link>
    </div>
    <div className="border ">
      <ChatBot name={params.chat} session={session} config={myAIConfig} />
    </div>
  </>
  )
}

