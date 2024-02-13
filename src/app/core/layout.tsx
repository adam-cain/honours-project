import { DashboardNav } from "@/components/dashboardNavbar/dashboardNav";
import { getSession } from "@/lib/auth"
import { LayoutProps } from "@/lib/types";

const Layout = async ({ children }: LayoutProps) => {
    const session = await getSession();

    return (
        <DashboardNav>
            {children}
        </DashboardNav>
    );
}

export default Layout;
