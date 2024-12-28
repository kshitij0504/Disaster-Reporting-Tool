import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";


const customPrismaAdapter = PrismaAdapter(prisma);

const authOptions: AuthOptions = {
  adapter: customPrismaAdapter as unknown as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true, // Explicitly select role
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role as string, // Ensure role is treated as string
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string; // Ensure role is string
      }
      return token;
    },    
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string; // Ensure id is string
        session.user.role = token.role as string; // Ensure role is string
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
