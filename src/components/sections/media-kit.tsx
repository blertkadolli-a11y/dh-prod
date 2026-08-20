import type { FC, ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeader } from '@/components/generals/section-header'
import { sectionIndex } from '@/constants/sections'
import { SplitLines } from '@/components/generals/split-lines'
import { Counter } from '@/components/generals/counter'
import { useParallax } from '@/hooks/use-parallax'
import { useLanguage } from '@/context/language'
import { Action } from '@/components/ui/action'

import { audience, collaborators, reachStats } from '@/constants/site'
import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

interface BarRowProps {
    label: string
    value: number
}

/** A single demographic row. The fill animates on scaleX — never width. */
const BarRow: FC<BarRowProps> = ({ label, value }): ReactNode => (
    <li className='media-item flex flex-col gap-2'>
        <div className='flex items-baseline justify-between gap-4'>
            <span className='type-meta text-foreground/70'>{label}</span>
            <span className='type-meta text-primary-bright'>
                <Counter value={value} suffix='%' />
            </span>
        </div>

        <div className='h-1 w-full overflow-hidden rounded-full bg-border'>
            <div
                className='audience-bar h-full origin-left rounded-full bg-primary'
                style={{ transform: `scaleX(${value / 100})` }}
                data-target={value / 100}
            />
        </div>
    </li>
)

export const MediaKit: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const statsRef = useRef<HTMLDListElement>(null)

    useParallax(statsRef, { from: 7, to: -7 })

    useGSAP(() => {
        const lines = gsap.utils.toArray<HTMLElement>('.media-line-inner')
        const bars = gsap.utils.toArray<HTMLElement>('.audience-bar')

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(lines, { y: '0%', opacity: 1 })

            return
        }

        gsap.set(lines, { y: '100%', opacity: 0 })
        gsap.to(lines, {
            y: '0%',
            opacity: 1,
            duration: DURATION.text,
            ease: EASE.reveal,
            stagger: STAGGER.lines,
            scrollTrigger: { trigger: sectionRef.current, start: TRIGGER_START.standard }
        })

        gsap.fromTo('.media-item',
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

        // Bars grow from nothing to the share each one represents. Their resting
        // value is already inline, so they read correctly with JS disabled.
        bars.forEach(bar => {
            gsap.fromTo(bar,
                { scaleX: 0 },
                {
                    scaleX: Number(bar.dataset.target ?? 1),
                    duration: DURATION.counter * 0.6,
                    ease: EASE.counter,
                    scrollTrigger: { trigger: bar, start: TRIGGER_START.counter, once: true }
                }
            )
        })
    }, { scope: sectionRef, dependencies: [lang] })

    return (
        <section
            ref={sectionRef}
            id='media'
            className='bg-grain relative border-t border-border bg-background px-6 py-[clamp(4rem,12vh,9rem)] lg:px-12'
        >
            <SectionHeader index={sectionIndex('media')} eyebrow={t.media.eyebrow} className='media-item' />

            <div className='mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20'>
                <div className='flex flex-col gap-6'>
                    <h2 className='type-display text-[clamp(2.5rem,7vw,5.5rem)] text-foreground'>
                        <SplitLines lines={t.media.titleLines} innerClassName='media-line-inner' />
                    </h2>

                    <p className='media-item max-w-[52ch] text-base leading-relaxed text-foreground/60'>
                        {t.media.body}
                    </p>

                    <span className='media-item type-meta text-primary-bright'>
                        {t.media.placement}
                    </span>

                    <div className='media-item mt-2'>
                        <Action
                            href='/partneritet'
                            variant='primary'
                            icon={<ArrowUpRight className='size-4' />}
                        >
                            {t.media.cta}
                        </Action>
                    </div>
                </div>

                <dl ref={statsRef} className='grid grid-cols-2 gap-px self-start border border-border bg-border'>
                    {reachStats.map(stat => (
                        <div
                            key={stat.label.en}
                            className='media-item flex flex-col gap-2 bg-background p-6 lg:p-8'
                        >
                            <dt className='type-meta order-2 text-foreground/45'>
                                {stat.label[lang]}
                            </dt>
                            <dd className='type-display order-1 text-[clamp(2.5rem,7vw,4.5rem)] text-foreground'>
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Audience breakdown */}
            <div className='mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-3 lg:gap-16'>
                <div className='flex flex-col gap-5'>
                    <span className='media-item type-meta text-foreground/40'>{t.media.geography}</span>
                    <ul className='flex flex-col gap-4'>
                        {audience.geography.map(row => (
                            <BarRow key={row.label.en} label={row.label[lang]} value={row.value} />
                        ))}
                    </ul>
                </div>

                <div className='flex flex-col gap-5'>
                    <span className='media-item type-meta text-foreground/40'>{t.media.age}</span>
                    <ul className='flex flex-col gap-4'>
                        {audience.age.map(row => (
                            <BarRow key={row.label} label={row.label} value={row.value} />
                        ))}
                    </ul>
                </div>

                <div className='flex flex-col gap-5'>
                    <span className='media-item type-meta text-foreground/40'>{t.media.split}</span>
                    <ul className='flex flex-col gap-4'>
                        <BarRow label={t.media.male} value={audience.split.male} />
                        <BarRow label={t.media.female} value={audience.split.female} />
                    </ul>
                </div>
            </div>

            {/* Renders nothing until the client supplies partners. */}
            {collaborators.length > 0 && (
                <div className='media-item mt-16 flex flex-col gap-6'>
                    <span className='type-meta text-foreground/40'>{t.media.collabTitle}</span>

                    <ul className='flex flex-wrap items-center gap-x-10 gap-y-4'>
                        {collaborators.map(name => (
                            <li key={name} className='type-meta text-foreground/70'>{name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}
