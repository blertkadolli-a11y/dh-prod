import type { FC, ReactNode } from 'react'
import type { Screening, Tier } from '@/constants/screenings'
import type { CheckoutResponse } from '@/pages/api/checkout'

import { Check, Loader2, Lock, Minus, Plus, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/components/generals/smooth-scroll-provider'
import { useLanguage } from '@/context/language'
import { Action } from '@/components/ui/action'
import { cn } from '@/lib/utils'

import { formatScreeningDateLong } from '@/constants/screenings'
import { DURATION, EASE, STAGGER } from '@/constants/motion'

/** Matches SERVICE_FEE in the checkout route; the server price is authoritative. */
const SERVICE_FEE: Record<string, number> = { ALL: 100, EUR: 1 }

const MAX_TICKETS = 10

interface CheckoutModalProps {
    screening: Screening
    onClose: () => void
}

export const CheckoutModal: FC<CheckoutModalProps> = ({ screening, onClose }): ReactNode => {
    const { lang, t } = useLanguage()
    const lenis = useLenis()

    const overlayRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    const successRef = useRef<HTMLDivElement>(null)

    const [tier, setTier] = useState<Tier>(screening.tiers[0])
    const [quantity, setQuantity] = useState(2)
    const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
    const [order, setOrder] = useState<CheckoutResponse | null>(null)

    const fee = SERVICE_FEE[screening.currency] ?? 0
    const subtotal = tier.price * quantity
    const total = (tier.price + fee) * quantity

    // Scroll lock + focus handoff. Lenis drives scrolling, so `overflow: hidden`
    // alone would not stop it — the instance has to be told to stop too.
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null

        document.body.classList.add('modal-open')
        lenis?.stop()
        closeRef.current?.focus()

        return () => {
            document.body.classList.remove('modal-open')
            lenis?.start()
            previouslyFocused?.focus?.()
        }
    }, [lenis])

    // Esc closes; Tab is contained inside the panel.
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
                return
            }

            if (event.key !== 'Tab') return

            const panel = panelRef.current
            if (!panel) return

            const focusable = panel.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement

            if (!event.shiftKey && active === last) {
                event.preventDefault()
                first.focus()
            } else if (event.shiftKey && active === first) {
                event.preventDefault()
                last.focus()
            }
        }

        document.addEventListener('keydown', handleKey)

        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.exit, ease: EASE.enter })
        gsap.fromTo(panelRef.current,
            { autoAlpha: 0, y: 40, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: DURATION.element, ease: EASE.element }
        )
        gsap.fromTo('.checkout-row',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: DURATION.element, ease: EASE.element, stagger: STAGGER.items, delay: 0.1 }
        )
    }, { scope: overlayRef })

    // Confirmation gets its own entrance so the state change reads as a step
    // forward rather than a swap.
    useGSAP(() => {
        if (status !== 'done') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(successRef.current,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: DURATION.element, ease: EASE.element }
        )
        gsap.fromTo('.success-tick',
            { scale: 0 },
            { scale: 1, duration: DURATION.element, ease: 'back.out(2)' }
        )
    }, { scope: successRef, dependencies: [status] })

    const submit = async () => {
        setStatus('processing')

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ screeningId: screening.id, tierId: tier.id, quantity })
            })

            const data: CheckoutResponse = await response.json()

            if (!response.ok) {
                setStatus('error')
                return
            }

            // Once Stripe is live the route returns a hosted checkout URL and
            // the customer is handed off to it. Until then we confirm inline.
            if (data.url) {
                window.location.href = data.url
                return
            }

            setOrder(data)
            setStatus('done')
        } catch {
            setStatus('error')
        }
    }

    const money = (value: number) => `${value.toLocaleString('en-US')} ${screening.currency}`

    return (
        <div
            ref={overlayRef}
            role='dialog'
            aria-modal='true'
            aria-label={t.checkout.title}
            onClick={onClose}
            className='fixed inset-0 z-[150] flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-6'
        >
            <div
                ref={panelRef}
                onClick={event => event.stopPropagation()}
                className='relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-7 sm:rounded-3xl lg:p-9'
            >
                <button
                    ref={closeRef}
                    type='button'
                    onClick={onClose}
                    aria-label={t.ui.close}
                    className='absolute top-5 right-5 flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground/70 transition-[transform,border-color,color] duration-300 ease-out hover:scale-110 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    <X className='size-4' />
                </button>

                {status === 'done' && order ? (
                    <div ref={successRef} className='flex flex-col items-center gap-5 py-8 text-center'>
                        <span className='success-tick flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                            <Check className='size-7' />
                        </span>

                        <h2 className='type-display text-[clamp(1.75rem,5vw,2.5rem)] text-foreground'>
                            {t.checkout.successTitle}
                        </h2>

                        <p className='max-w-[34ch] text-sm leading-relaxed text-foreground/60'>
                            {t.checkout.successBody}
                        </p>

                        <div className='mt-2 flex flex-col items-center gap-1.5 rounded-2xl border border-border px-6 py-4'>
                            <span className='type-meta text-foreground/40'>{t.checkout.reference}</span>
                            <span className='type-title text-xl text-primary-bright'>{order.reference}</span>
                        </div>

                        <span className='type-meta text-foreground/45'>
                            {quantity} × {tier.label[lang]} — {money(order.total ?? total)}
                        </span>

                        <Action as='button' still variant='outline' onClick={onClose} className='mt-2'>
                            {t.checkout.done}
                        </Action>
                    </div>
                ) : (
                    <div className='flex flex-col gap-7'>
                        <header className='checkout-row flex flex-col gap-2 pr-12'>
                            <span className='type-meta text-primary-bright'>{screening.film}</span>
                            <h2 className='type-display text-[clamp(1.75rem,5vw,2.5rem)] text-foreground'>
                                {screening.city[lang]}
                            </h2>
                            <span className='text-sm text-foreground/55'>
                                {screening.venue} · {formatScreeningDateLong(screening.date, lang)} · {screening.time}
                            </span>
                        </header>

                        {/* Seat tier */}
                        <fieldset className='checkout-row flex flex-col gap-3'>
                            <legend className='type-meta mb-3 text-foreground/40'>{t.checkout.tier}</legend>

                            {screening.tiers.map(option => {
                                const active = option.id === tier.id

                                return (
                                    <button
                                        key={option.id}
                                        type='button'
                                        onClick={() => setTier(option)}
                                        aria-pressed={active}
                                        className={cn(
                                            'flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none',
                                            active
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-foreground/25'
                                        )}
                                    >
                                        <span className='flex items-center gap-3'>
                                            <span
                                                aria-hidden='true'
                                                className={cn(
                                                    'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                                                    active ? 'border-primary bg-primary' : 'border-foreground/30'
                                                )}
                                            >
                                                {active && <span className='size-1.5 rounded-full bg-primary-foreground' />}
                                            </span>
                                            <span className='type-meta text-foreground/85'>{option.label[lang]}</span>
                                        </span>

                                        <span className='type-meta shrink-0 text-foreground/60'>
                                            {money(option.price)}
                                        </span>
                                    </button>
                                )
                            })}
                        </fieldset>

                        {/* Quantity */}
                        <div className='checkout-row flex flex-col gap-3'>
                            <span className='type-meta text-foreground/40'>{t.checkout.quantity}</span>

                            <div className='flex items-center justify-between gap-4 rounded-2xl border border-border px-5 py-3'>
                                <button
                                    type='button'
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    aria-label='-'
                                    className='flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-primary disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                                >
                                    <Minus className='size-4' />
                                </button>

                                <span className='type-display text-3xl text-foreground' aria-live='polite'>
                                    {quantity}
                                </span>

                                <button
                                    type='button'
                                    onClick={() => setQuantity(q => Math.min(MAX_TICKETS, q + 1))}
                                    disabled={quantity >= MAX_TICKETS}
                                    aria-label='+'
                                    className='flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-primary disabled:cursor-not-allowed disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                                >
                                    <Plus className='size-4' />
                                </button>
                            </div>

                            {quantity >= MAX_TICKETS && (
                                <span className='type-meta text-foreground/35'>{t.checkout.max}</span>
                            )}
                        </div>

                        {/* Summary */}
                        <dl className='checkout-row flex flex-col gap-2.5 border-t border-border pt-5'>
                            <div className='flex items-center justify-between'>
                                <dt className='type-meta text-foreground/45'>
                                    {quantity} × {money(tier.price)}
                                </dt>
                                <dd className='type-meta text-foreground/70'>{money(subtotal)}</dd>
                            </div>

                            <div className='flex items-center justify-between'>
                                <dt className='type-meta text-foreground/45'>{t.checkout.fee}</dt>
                                <dd className='type-meta text-foreground/70'>{money(fee * quantity)}</dd>
                            </div>

                            <div className='mt-2 flex items-baseline justify-between border-t border-border pt-4'>
                                <dt className='type-meta text-foreground'>{t.checkout.total}</dt>
                                <dd className='type-display text-3xl text-foreground'>{money(total)}</dd>
                            </div>
                        </dl>

                        {status === 'error' && (
                            <p role='alert' className='type-meta text-primary-bright'>
                                {t.partner.failed}
                            </p>
                        )}

                        <div className='checkout-row flex flex-col gap-3'>
                            <button
                                type='button'
                                onClick={submit}
                                disabled={status === 'processing'}
                                data-cursor-hover
                                className='group/pay relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 py-5 text-primary-foreground transition-colors duration-300 hover:bg-primary-bright disabled:cursor-wait focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none'
                            >
                                {status === 'processing' ? (
                                    <>
                                        <Loader2 className='size-4 animate-spin' />
                                        <span className='type-meta'>{t.checkout.processing}</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className='size-3.5' />
                                        <span className='type-meta'>{t.checkout.pay}</span>
                                    </>
                                )}
                            </button>

                            <span className='type-meta flex items-center justify-center gap-2 text-foreground/30'>
                                <Lock className='size-3' />
                                {t.checkout.secure}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
