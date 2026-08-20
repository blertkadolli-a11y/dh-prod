import type { FC, ReactNode } from 'react'
import type { Screening, SeatStatus } from '@/constants/screenings'

import { MapPin, Ticket } from 'lucide-react'
import { useRef, useState } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeader } from '@/components/generals/section-header'
import { CheckoutModal } from '@/components/film/checkout-modal'
import { sectionIndex } from '@/constants/sections'
import { useLanguage } from '@/context/language'
import { Action } from '@/components/ui/action'
import { cn } from '@/lib/utils'

import { formatScreeningDate, fromPrice, screenings } from '@/constants/screenings'
import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

const statusStyle: Record<SeatStatus, string> = {
    available: 'text-primary-bright',
    few: 'text-amber-400',
    soldout: 'text-foreground/35'
}

export const Tickets: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const [active, setActive] = useState<Screening | null>(null)

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo('.tickets-item',
            { y: 28, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: DURATION.element,
                ease: EASE.element,
                stagger: STAGGER.items,
                scrollTrigger: { trigger: sectionRef.current, start: TRIGGER_START.standard }
            }
        )

        // Each row arrives as its own beat: the hairline draws left-to-right,
        // then the row's contents rise behind it.
        gsap.fromTo('.screening-rule',
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: DURATION.text,
                ease: EASE.reveal,
                stagger: STAGGER.items,
                scrollTrigger: { trigger: '.screening-list', start: 'top 88%' }
            }
        )

        gsap.fromTo('.screening-row',
            { y: 34, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: DURATION.element,
                ease: EASE.element,
                stagger: STAGGER.items,
                scrollTrigger: { trigger: '.screening-list', start: 'top 88%' }
            }
        )

        // The date column drifts against the scroll — a small parallax that
        // makes the list feel like it has depth rather than being a table.
        gsap.utils.toArray<HTMLElement>('.screening-date').forEach(date => {
            gsap.fromTo(date,
                { yPercent: 14 },
                {
                    yPercent: -14,
                    ease: 'none',
                    scrollTrigger: { trigger: date.closest('li'), start: 'top bottom', end: 'bottom top', scrub: 1 }
                }
            )
        })
    }, { scope: sectionRef, dependencies: [lang] })

    const statusLabel = (status: SeatStatus) =>
        status === 'soldout' ? t.tickets.soldOut : status === 'few' ? t.tickets.few : t.tickets.available

    return (
        <>
            <section
                ref={sectionRef}
                id='bileta'
                className='relative border-t border-border bg-background px-6 py-[clamp(4rem,12vh,9rem)] lg:px-12'
            >
                <SectionHeader index={sectionIndex('tickets')} eyebrow={t.tickets.eyebrow} className='tickets-item' />

                <div className='mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16'>
                    <div className='flex flex-col gap-5'>
                        <h2 className='tickets-item type-display text-[clamp(2.25rem,6vw,4.5rem)] text-foreground'>
                            {t.tickets.title}
                        </h2>

                        <p className='tickets-item max-w-[48ch] text-base leading-relaxed text-foreground/60'>
                            {t.tickets.body}
                        </p>
                    </div>

                    <span className='tickets-item type-meta flex items-center gap-2.5 text-foreground/45'>
                        <Ticket className='size-4' />
                        {screenings.length} {t.tickets.allDates}
                    </span>
                </div>

                <ul className='screening-list mt-12 flex flex-col'>
                    {screenings.map(screening => {
                        const sold = screening.status === 'soldout'

                        return (
                            <li key={screening.id} className='group relative'>
                                <div className='screening-rule h-px w-full origin-left bg-border' />

                                {/* Crimson wash that wipes in from the left on hover. */}
                                <span
                                    aria-hidden='true'
                                    className={cn(
                                        'pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 origin-left scale-x-0 rounded-2xl bg-primary/[0.07] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                                        !sold && 'group-hover:scale-x-100'
                                    )}
                                />

                                <div className='screening-row relative flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:gap-8 lg:py-7'>
                                    <div className='flex w-full shrink-0 items-baseline gap-3 lg:w-40'>
                                        <span
                                            className={cn(
                                                'screening-date type-display text-[clamp(1.75rem,3.5vw,2.5rem)] transition-colors duration-500',
                                                sold ? 'text-foreground/40' : 'text-foreground group-hover:text-primary-bright'
                                            )}
                                        >
                                            {formatScreeningDate(screening.date, lang)}
                                        </span>
                                        <span className='type-meta text-foreground/45'>{screening.time}</span>
                                    </div>

                                    <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
                                        <span className='type-title text-[clamp(1.1rem,2vw,1.5rem)] text-foreground transition-transform duration-500 ease-out group-hover:translate-x-1'>
                                            {screening.city[lang]}
                                        </span>
                                        <span className='flex items-center gap-2 text-sm text-foreground/50 transition-transform duration-500 ease-out group-hover:translate-x-1'>
                                            <MapPin className='size-3.5 shrink-0' />
                                            {screening.venue}
                                        </span>
                                    </div>

                                    <div className='flex shrink-0 flex-col gap-1.5 lg:w-40'>
                                        <span className={cn('type-meta', statusStyle[screening.status])}>
                                            {statusLabel(screening.status)}
                                        </span>
                                        <span className='type-meta text-foreground/45'>
                                            {t.tickets.from} {fromPrice(screening)} {screening.currency}
                                        </span>
                                    </div>

                                    <div className='shrink-0'>
                                        {sold ? (
                                            <span className='type-meta inline-flex cursor-not-allowed items-center rounded-full border border-border px-7 py-4 text-foreground/30'>
                                                {t.tickets.soldOut}
                                            </span>
                                        ) : (
                                            <Action
                                                as='button'
                                                variant='primary'
                                                data-cursor-label={t.ui.buy}
                                                icon={<Ticket className='size-3.5' />}
                                                onClick={() => setActive(screening)}
                                            >
                                                {t.tickets.buy}
                                            </Action>
                                        )}
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className='screening-rule h-px w-full origin-left bg-border' />
            </section>

            {active && <CheckoutModal screening={active} onClose={() => setActive(null)} />}
        </>
    )
}
