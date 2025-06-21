import { DefaultSession, NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider?: string; 
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    provider?: string; // Add this if you want to store it in the token

  }
}


export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: new Date(), // Google accounts come pre-verified
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        console.log("User found:", user);

        if (!user) {
          throw new Error("User not found");
        }

        // Check if user is registered with OAuth
        const userAccount = await prisma.account.findFirst({
          where: { userId: user.id },
        });

        if (userAccount && userAccount.provider !== "credentials") {
          throw new Error(`This account uses ${userAccount.provider} authentication. Please sign in with ${userAccount.provider}.`);
        }

        // Check email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        // Check if user has password (not OAuth user)
        if (!user.password) {
          throw new Error("Invalid login method");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    error: "/login", // Error messages are passed via query
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth sign-in without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      // For credentials, check email verification
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      });
      
      return !!dbUser?.emailVerified;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  debug: process.env.NODE_ENV === "development",
};

 const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };