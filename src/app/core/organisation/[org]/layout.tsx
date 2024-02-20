import { LayoutProps } from "@/lib/types";
import { hasOrgPermission } from "@/lib/actions/organisation";
import Unauthorized from "@/components/unauthorised";

const Layout = async ({ children, params }: { children: LayoutProps, params: { org: string } }) => {
    "use server"
    const orgPermission = await hasOrgPermission(params.org);

    return (
        orgPermission ? <>{children}</> : <><Unauthorized orgName={params.org} /></>
    );
}

export default Layout;