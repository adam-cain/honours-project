import Link from "next/link";
import { Logo } from "@/components/PageComponents";
// inspo
//https://www.markdx.site/

function HomeNav(){
  return(
  <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-900 justify-between">
      <aside>
        <Logo/>
      </aside>
      <nav className="absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] hidden md:block">
        <ul className="flex items-center gap-4 list-none">
          <li>
            <Link href="#">Products</Link>
          </li>
          <li>
            <Link href="#">Pricing</Link>
          </li>
          <li>
            <Link href="#">Resources</Link>
          </li>
          <li>
            <Link href="#">Documentation</Link>
          </li>
          <li>
            <Link href="/market">Market</Link>
          </li>
        </ul>
      </nav>
      <aside className="flex items-center gap-4">
        <div
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffd700_0%,#fffae2_50%,#ffd700_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            <Link
            href="/signup"
            className="size-full flex items-center justify center text-nowrap hover:text-stone-200">
            Sign up
            </Link>
            <span className="mx-4 h-full w-1 bg-slate-400 flex items-center justify center">
              <span className=" text-xs absolute -translate-x-1/2 flex items-center justify center mx-auto bg-black">or</span>
              </span> {/* Separator */}
            <Link
            href="/login"
            className="size-full flex items-center justify center hover:text-stone-200">
            Log in
            </Link>
          </span>
        </div>
      </aside>
    </header>)
}

export default function HomePage() {
  return (<main>
    <HomeNav />
    <section className="h-full">
    
    </section>
  </main>
  );
}
