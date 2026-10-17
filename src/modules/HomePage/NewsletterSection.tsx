"use client";

import { Mail, Send } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-[#faf9f7] py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#e8ddd8] bg-white px-6 py-12 md:px-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff8f5] text-[#7d1f2a]">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#241f20]">
                  Get new writing in your inbox
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-[#827673]">
                New novels, poems, and lyrics — sent occasionally, never spam.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-lg gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-lg border border-[#ded1cc] bg-[#faf9f7] px-4 text-sm text-[#241f20] outline-none focus:border-[#7d1f2a]"
              />
              <button
                type="submit"
                className="flex h-12 items-center gap-2 rounded-lg bg-[#7d1f2a] px-5 text-sm font-semibold text-white hover:bg-[#651923]"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
