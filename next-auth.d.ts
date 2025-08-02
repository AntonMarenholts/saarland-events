import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // <-- Наше новое поле
    };
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string | null; // <-- Наше новое поле
    }
}