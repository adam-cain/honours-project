import { DashboardNav } from "@/components/dashboardNavbar/dashboardNav";

import { LayoutProps } from "@/lib/types";

const Layout = ({ children }: LayoutProps) => {
    return (
        <DashboardNav>
            {children}
        </DashboardNav>
    );
}

export default Layout;
