import { ReactNode } from "react";
import { getChat } from "@/lib/actions/chat";
import { NonExistantChat } from "@/components/unauthorised";

const Layout = async ({ children, params }: { children: ReactNode, params: { team: string, chat: string } }) => {
    const teamPermission = await getChat(params.team, params.chat);

    return (
        teamPermission ? <>{children}</> : <NonExistantChat chat={params.chat} team={params.team} />
    );
}

export default Layout;