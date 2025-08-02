"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
      >
        Выйти
      </button>
    );
  }
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
    >
      Войти через Google
    </button>
  );
}