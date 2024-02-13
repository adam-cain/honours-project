import { LayoutProps } from "@/lib/types"
import { getSession } from "@/lib/auth"
import NavBar from "./nav"

export async function DashboardNav({ children }: LayoutProps) {
  const session = await getSession();

  return (
        <NavBar data={session} children={children} />
  )
}