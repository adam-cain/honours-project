import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

import CredentialsProvider from "next-auth/providers/credentials";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Check if we're running on Vercel or locally
const DEPLOYED = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password:  {  label: "Password" }
      },
      async authorize(credentials, req) {
        // Find the user by email
        console.log(credentials);
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email || '' },
          select: {
            id: true,
            email: true,
            password: true,
            username: true,
          },
        });
    
        // Check if user exists
        if (!user) {
          throw new Error('No user found with this email');
        }
    
        // If the user has signed up using OAuth and doesn't have a password
        if (user.password === null) {
          throw new Error('This account is linked to a social provider. Please login with that provider.');
        }
    
        // If the user has a password, verify it
        if (user.password && credentials?.password && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, email: user.email, name: user.username };
        } else {
          throw new Error('Invalid email or password');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  pages: {
    signIn: `/auth/login`,
    verifyRequest: `/auth/login`,
    error: "/auth/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${DEPLOYED ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: DEPLOYED
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: DEPLOYED,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        username: token?.user?.username,
      };
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}