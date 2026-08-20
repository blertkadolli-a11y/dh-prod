import type { FC, ReactNode } from 'react'
import type { PressKind } from '@/constants/press'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeader } from '@/components/generals/section-header'
import { sectionIndex } from '@/constants/sections'
import { useLanguage } from '@/context/language'
import { pressItems } from '@/constants/press'

import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

const kindLabel: Record<PressKind, { sq: string; en: string }> = {
    interview: { sq: 'Intervistë', en: 'Interview' },
    feature: { sq: 'Artikull', en: 'Feature' },
    award: { sq: 'Çmim', en: 'Award' },
    festival: { sq: 'Festival', en: 'Festival' }
}

export const Press: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo('.press-item',
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
    }, { scope: sectionRef, dependencies: [lang] })

    // Renders nothing at all until real coverage is supplied, so the page never
    // shows an empty shell. See the note in `@/constants/press`.
    if (pressItems.length === 0) return null

    return (
        <section
            ref={sectionRef}
            id='shtypi'
            className='relative border-t border-border bg-background px-6 py-[clamp(4rem,12vh,9rem)] lg:px-12'
        >
            <SectionHeader index={sectionIndex('press')} eyebrow={t.press.eyebrow} className='press-item' />

            <h2 className='press-item type-display mt-10 text-[clamp(2.25rem,6vw,4.5rem)] text-foreground'>
                {t.press.title}
            </h2>

            <ul className='mt-10 flex flex-col'>
                {pressItems.map(item => (
                    <li key={item.id} className='press-item border-t border-border last:border-b'>
                        <a
                            href={item.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            data-cursor-hover
                            className='group flex flex-col gap-3 py-6 transition-colors duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none lg:flex-row lg:items-center lg:gap-8 lg:py-7'
                        >
                            <span className='type-meta w-24 shrink-0 text-primary-bright'>
                                {item.year}
                            </span>

                            <span className='type-meta w-32 shrink-0 text-foreground/45'>
                                {kindLabel[item.kind][lang]}
                            </span>

                            <span className='type-title min-w-0 flex-1 text-[clamp(1.1rem,2vw,1.5rem)] text-foreground'>
                                {item.title}
                            </span>

                            <span className='type-meta shrink-0 text-foreground/55'>
                                {item.outlet}
                            </span>

                            <span className='flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground/50 transition-[transform,border-color,color] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary group-hover:text-foreground'>
                                <ArrowUpRight className='size-4' />
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}
