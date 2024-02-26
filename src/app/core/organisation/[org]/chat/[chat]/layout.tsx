import { ReactNode } from "react";
import { getChat } from "@/lib/actions/chat";
import { NonExistantChat } from "@/components/unauthorised";

const Layout = async ({ children, params }: { children: ReactNode, params: { org: string, chat: string } }) => {
    const orgPermission = await getChat(params.org, params.chat);

    return (
        orgPermission ? <>{children}</> : <NonExistantChat chat={params.chat} org={params.org} />
    );
}

export default Layout;