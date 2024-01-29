import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
    console.log(`path: ${path}`);
  // For root domain only
  if (hostname == process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    const session = await getToken({ req });
    if (!session) {
      if (path.startsWith("/core")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    } else {
      return NextResponse.rewrite(
        new URL(`/core${path === "/" ? "" : path}`, req.url),
      );
    }
  } else {
    const subdomain = hostname.split(".")[0];
    console.log(`rewriting to dynamic route ${subdomain}${path}`);
    return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }
}
