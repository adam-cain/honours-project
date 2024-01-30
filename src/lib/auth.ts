import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';

import CredentialsProvider from "next-auth/providers/credentials";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Check if we're running on Vercel or locally
const DEPLOYED = !!process.env.VERCEL_URL;

export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let errorMessage = [];

  if (password.length < minLength) {
    errorMessage.push('at least 8 chars');
  }
  if (!hasUpperCase) {
    errorMessage.push('a uppercase letter');
  }
  if (!hasLowerCase) {
    errorMessage.push('a lowercase letter');
  }
  if (!hasNumbers) {
    errorMessage.push('a number');
  }
  if (!hasSpecialChar) {
    errorMessage.push('a special char');
  }

  return errorMessage.length > 0 ? `Must include ${errorMessage.join(', ')}.` : '';
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password:  {  label: "Password", type: "password" }
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
          name: profile.name || profile.login,
          username: profile.username,
          email: profile.email,
          image: profile.avatar_url,
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
        username: token?.user?.username || token?.user?.gh_username,
      };
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}