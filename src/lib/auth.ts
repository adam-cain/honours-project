import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { User } from "@/lib/types";
import { Role } from "@prisma/client";

import CredentialsProvider from "next-auth/providers/credentials";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
        password:  {  label: "Password", type: "password"}
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
          return { id: user.id, email: user.email, name: user.username };
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
    }
  },
};

function roleValue(role: Role): number {
  const roleHierarchy = {
    VIEW_ONLY: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  return roleHierarchy[role];
}

export async function withOrgAuth(arg1: Role | Function, arg2?: Function) {
  "use server"
  let requiredRole: Role;
  let action: Function;

  if (typeof arg1 === "function") {
    // If the first argument is a function, assume no role was provided and use the default role
    requiredRole = Role.VIEW_ONLY;
    action = arg1;
  } else {
    // If the first argument is not a function, assume it's a role and the second argument is the action
    requiredRole = arg1;
    action = arg2!;
  }

  return async (
    formData: FormData | null,
    orgId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }

    // Fetch organization and check if the session user is a member
    const organization = await prisma.organization.findUnique({
      where: {
        id: orgId,
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    // Check if the user is a member of the organization
    if (!organization || organization.members.length === 0) {
      return {
        error: "Not authorized or organization does not exist",
      };
    }

    const memberRole = organization.members[0].role;
    if (roleValue(memberRole) < roleValue(requiredRole)) {
      return {
        error: `Your current role(${memberRole}) does not grant you the necessary permissions(${requiredRole}) to perform this action`,
      };
    }
    
    // Proceed with the action if authorized
    return action(formData, organization, key);
  };
}