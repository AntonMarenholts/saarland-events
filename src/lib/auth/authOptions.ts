import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Этот callback добавляет роль пользователя в токен сессии
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    // Этот callback добавляет роль из токена в объект сессии
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    // Этот callback вызывается при каждом входе
    async signIn({ user: authUser }) {
      if (!authUser.email) {
        return false;
      }
      // Проверяем, есть ли пользователь в нашей базе
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, authUser.email),
      });

      // Если пользователя нет, создаем новую запись
      if (!existingUser) {
        await db.insert(users).values({
          email: authUser.email,
          name: authUser.name,
          image: authUser.image,
          role: "customer", // Роль по умолчанию
        });
      }
      return true;
    },
  },
};