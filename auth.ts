import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("Auth: Missing credentials in request");
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = (credentials.password as string).trim();
        
        // Root fallback Admin login
        if (
          email === (process.env.ADMIN_EMAIL || "").toLowerCase().trim() &&
          password === (process.env.ADMIN_PASSWORD || "").trim()
        ) {
          console.log("Auth: Successful login via Root Fallback for", email);
          return { id: "admin-root", name: "Super Admin", email: email, role: "admin" } as any;
        }
        
        try {
          console.log("Auth: Attempting DB lookup for", email);
          const user = await prisma.user.findUnique({
            where: { email: email }
          });
          
          if (!user) {
            console.warn("Auth: No user found in DB for email", email);
            return null;
          }

          if (!user.password) {
            console.error("Auth: User found but has NO password field in DB", email);
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (passwordsMatch) {
            console.log("Auth: Password match successful for", email);
            return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
          } else {
            console.warn("Auth: Password MISMATCH for", email);
          }
        } catch (error: any) {
          console.error("CRITICAL AUTH DB ERROR:", {
            message: error.message,
            code: error.code,
            stack: error.stack?.split("\n").slice(0, 3).join("\n")
          });
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" }
});
