"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-violet-400 mb-2">Veo3 AI</h1>
        <p className="text-zinc-400 mb-8">Sign in to generate videos</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}