import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { User } from "@prisma/client";

import CredentialsProvider from "next-auth/providers/credentials";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

// Check if we're deployed or running locally
const DEPLOYED = !!process.env.VERCEL_URL;

export function getSession(): Promise<User> {
  return getServerSession(authOptions) as Promise<User>;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email || '' },
          select: {
            id: true,
            email: true,
            password: true,
            username: true,
            image: true,
          },
        });

        // Check if user exists
        if (!user) {
          throw new Error('No user found with this email');
        }

        // If the user has signed up using OAuth and doesn't have a password
        if (user.password === null) {
          throw new Error('This account is linked to a authentication provider. Please login with that provider.');
        }

        // If the user has a password, verify it
        if (user.password && credentials?.password && bcrypt.compareSync(credentials.password, user.password)) {
          return { 
            id: user.id, 
            email: user.email, 
            name: user.username, 
            username: user.username,
            image: user.image
          };
        } else {
          throw new Error('Incorrect email or password');
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
      },
      profile(profile,) {
        return {
          id: profile.sub,
          email: profile.email,
          image: profile.picture,
          username: profile.name,
          name: profile.name,
        };
      }
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
        },
        // https://ratemyuniaccom.tech/api/auth/callback/github
        // http://localhost:3000/api/auth/callback/github 
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          image: profile.avatar_url,
          username: profile.name ?? profile.login,
          name: profile.name ?? profile.login,
        };
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
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
    jwt: async ({ token, user, trigger }:{token:JWT, user:User | AdapterUser, trigger?:"signIn" | "update" | "signUp" | undefined}) => {
      
      if (trigger === "update") {
        // Triggered on update() call, fetch updated user details
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            username: true,
            image: true,
            id: true,
            email:true
          },
        });   
             
        if (updatedUser) {
          token = {
            ...token,
            username: updatedUser.username,
            name: updatedUser.username,
            image: updatedUser.image,
            picture: updatedUser.image,
            email: updatedUser.email,
            id: updatedUser.id,
          };          
        }
      } else {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token, trigger }) => {
      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
      };
      
      return session;
    },
  }
};