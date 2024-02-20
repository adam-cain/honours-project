import { getSession } from "@/lib/auth"
import { LayoutProps } from "@/lib/types";
import NavBar from "@/components/dashboardNavbar";

const Layout = async ({ children }: LayoutProps) => {
    const session = await getSession();
    return (
        <NavBar userData={session}>
            {children}
        </NavBar>
    );
}

export default Layout;
