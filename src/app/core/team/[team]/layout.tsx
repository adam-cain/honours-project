import { hasTeamPermission } from "@/lib/actions/team";
import { Unauthorized } from "@/components/unauthorised";
import { ReactNode } from "react";

const Layout = async ({ children, params }: { children: ReactNode, params: { team: string } }) => {
    const teamPermission = await hasTeamPermission(params.team);

    return (
        teamPermission ? <>{children}</> : <><Unauthorized teamName={params.team} /></>
    );
}

export default Layout;