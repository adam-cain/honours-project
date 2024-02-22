import { LayoutProps } from "@/lib/types";
import { hasOrgPermission } from "@/lib/actions/organisation";
import Unauthorized from "@/components/unauthorised";
import { ReactNode } from "react";

const Layout = async ({ children, params }: { children: ReactNode, params: { org: string } }) => {
    "use server"
    const orgPermission = await hasOrgPermission(params.org);

    return (
        orgPermission ? <>{children}</> : <><Unauthorized orgName={params.org} /></>
    );
}

export default Layout;