'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export default function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setStatus('error')
                setMessage(data.error || 'Erro ao inscrever. Tente de novo.')
                return
            }
            setStatus('success')
            setEmail('')
            setMessage('Inscrito com sucesso! Em breve você receberá nossas novidades.')
        } catch {
            setStatus('error')
            setMessage('Erro de conexão. Tente de novo.')
        }
    }

    return (
        <section className="relative overflow-hidden bg-[#E1FF00] py-16 lg:py-24">
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
                        onSubmit={handleSubmit}
                        className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                        <input
                            type="email"
                            placeholder="seu-email@exemplo.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                            className="flex-1 rounded-full border border-black/10 bg-white px-8 py-4 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 md:text-lg disabled:opacity-70"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="rounded-full bg-black px-10 py-4 text-lg font-bold text-[#E1FF00] transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
                        </button>
                    </form>

                    {message && (
                        <p className={`mt-4 text-sm font-medium ${status === 'error' ? 'text-red-700' : 'text-black/80'}`}>
                            {message}
                        </p>
                    )}

                    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-black/40">
                        Respeitamos sua privacidade. Cancele a qualquer momento.
                    </p>
                </div>
            </div>
        </section>
    )
}
