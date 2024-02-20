import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import {userHasOrgPermission} from "@/lib/auth";
import { hasOrgPermission } from "@/lib/actions/organisation";
// Configuration for the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

// Middleware function that handles requests
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the search parameters of the request as a string
  const searchParams = req.nextUrl.searchParams.toString();

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0
    ? `?${searchParams}` : ""}`;

  // For root domain only
  if (hostname == process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    const session = await getToken({ req });
    if (session) {
      return coreRedirect(req, path);
    } else {
      if (path.startsWith("/core")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }
  } else {
    const subdomain = hostname.split(".")[0];
    return NextResponse.rewrite(new URL(`/external/${subdomain}${path}`, req.url));
  }
}

function coreRedirect(req: NextRequest, path: string) {
  // console.log(`/_core${path === "/" ? "" : path}`,"->",req.url);
  return NextResponse.rewrite(new URL(`/core${path === "/" ? "" : path}`, req.url));
}