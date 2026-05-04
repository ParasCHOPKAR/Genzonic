import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        try {
          const { email, password } = credentials;

          // 🔥 Connect DB
          await connectDB();

          // 🔍 Find user
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("User not found");
          }

          // 🔐 Compare password
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            throw new Error("Invalid password");
          }

          // ✅ Return user WITH ROLE
          return {
            id: user._id.toString(),
            name: user.name || "User",
            email: user.email,
            role: user.role, // 🔥 IMPORTANT
          };
        } catch (error: any) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    // 🔐 Add data to JWT
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // ✅ merged
      }
      return token;
    },

    // 🔐 Send data to session
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // ✅ merged
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};