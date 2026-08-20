import type { FC, ReactNode } from 'react'

import { Ticket } from 'lucide-react'
import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { Action } from '@/components/ui/action'
import { SectionHeader } from '@/components/generals/section-header'
import { sectionIndex } from '@/constants/sections'
import { useParallax } from '@/hooks/use-parallax'
import { useLanguage } from '@/context/language'
import { upcoming } from '@/constants/films'

import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

export const Upcoming: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    useParallax(titleRef, { from: 8, to: -8 })

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo('.upcoming-item',
            { y: 32, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: DURATION.element,
                ease: EASE.element,
                stagger: STAGGER.items,
                scrollTrigger: { trigger: sectionRef.current, start: TRIGGER_START.standard }
            }
        )
    }, { scope: sectionRef, dependencies: [lang] })

    return (
        <section
            ref={sectionRef}
            id='se-shpejti'
            className='bg-grain relative border-t border-border bg-background px-6 py-[clamp(4rem,12vh,9rem)] lg:px-12'
        >
            <SectionHeader index={sectionIndex('upcoming')} eyebrow={t.upcoming.eyebrow} className='upcoming-item' />

            <div className='mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16'>
                <div className='flex flex-col gap-6'>
                    <span className='upcoming-item type-meta w-fit border border-primary px-3 py-1.5 text-primary-bright'>
                        {t.upcoming.tag}
                    </span>

                    <h2 ref={titleRef} className='upcoming-item type-display text-[clamp(4rem,16vw,14rem)] text-foreground'>
                        {upcoming.title}
                    </h2>
                </div>

                <div className='flex flex-col gap-6'>
                    <p className='upcoming-item max-w-[42ch] text-base leading-relaxed text-foreground/65'>
                        {t.upcoming.body}
                    </p>

                    <div className='upcoming-item'>
                        <Action href='#bileta' variant='primary' icon={<Ticket className='size-4' />}>
                            {t.upcoming.cta}
                        </Action>
                    </div>
                </div>
            </div>
        </section>
    )
}
