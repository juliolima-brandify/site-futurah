'use client'

import { Mail } from 'lucide-react'

export default function Newsletter() {
    return (
        <section className="relative overflow-hidden bg-[#E1FF00] py-16 lg:py-24">
            {/* Decorative background elements */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-black/5 blur-3xl" />

            <div className="container relative mx-auto px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#E1FF00]">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h2 className="mb-4 text-4xl font-black uppercase tracking-tight text-black md:text-6xl">
                        Newsletter da Futurah
                    </h2>
                    <p className="mb-10 text-lg font-medium text-black/70 md:text-xl">
                        Receba as últimas novidades sobre IA, design e performance direto no seu e-mail.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                        <input
                            type="email"
                            placeholder="seu-email@exemplo.com"
                            required
                            className="flex-1 rounded-full border border-black/10 bg-white px-8 py-4 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 md:text-lg"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-black px-10 py-4 text-lg font-bold text-[#E1FF00] transition-transform hover:scale-105 active:scale-95"
                        >
                            Inscrever-se
                        </button>
                    </form>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-black/40">
                        Respeitamos sua privacidade. Cancele a qualquer momento.
                    </p>
                </div>
            </div>
        </section>
    )
}
