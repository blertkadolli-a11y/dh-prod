import type { FC, ReactNode } from 'react'

import { ArrowDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SplitChars } from '@/components/generals/split-chars'
import { useLanguage } from '@/context/language'
import { brand } from '@/constants/site'

import { DURATION, EASE, STAGGER } from '@/constants/motion'
import { HERO_START } from '@/constants/intro'

/** Ego (2023) — the most recent feature. Doubles as the hero plate. */
const HERO_STILL = '/stills/ego.jpg'


export const Hero: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const plateRef = useRef<HTMLDivElement>(null)
    const plateInnerRef = useRef<HTMLDivElement>(null)
    const nameRef = useRef<HTMLHeadingElement>(null)

    const roles = t.hero.roles.split(' · ')

    /**
     * Pointer parallax lives in a plain effect, not in useGSAP.
     *
     * useGSAP discards whatever its callback returns — it reverts the GSAP
     * context, which kills tweens, but a window listener is not a GSAP object
     * and would never be removed. Since that hook re-runs on `lang`, every
     * language toggle stacked another live mousemove listener.
     */
    useEffect(() => {
        const plate = plateRef.current
        if (!plate) return
        if (!window.matchMedia('(pointer: fine)').matches) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        // quickTo keeps this off the render path: no tween is created per move.
        const plateX = gsap.quickTo(plate, 'xPercent', { duration: 1.1, ease: 'power3' })
        const plateY = gsap.quickTo(plate, 'yPercent', { duration: 1.1, ease: 'power3' })

        const handlePointer = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 2
            const y = (event.clientY / window.innerHeight - 0.5) * 2
            plateX(x * 2.2)
            plateY(y * 1.6)
        }

        window.addEventListener('mousemove', handlePointer)

        return () => window.removeEventListener('mousemove', handlePointer)
    }, [])

    useGSAP(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reduced) {
            gsap.set('.char, .hero-meta, .hero-rule, .hero-cue', { opacity: 1, y: 0, yPercent: 0, scaleX: 1 })
            gsap.set([plateRef.current, plateInnerRef.current], { opacity: 1, scale: 1 })

            return
        }

        const timeline = gsap.timeline({ delay: HERO_START })

        timeline
            // Plate pushes in from a slow zoom — the shot settling.
            .fromTo(plateRef.current,
                { scale: 1.18, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.8, ease: EASE.element },
                0
            )
            // Name resolves letter by letter.
            .fromTo('.char',
                { yPercent: 115, opacity: 0 },
                {
                    yPercent: 0,
                    opacity: 1,
                    duration: DURATION.text,
                    ease: EASE.reveal,
                    stagger: 0.028
                },
                0.15
            )
            .fromTo('.hero-rule',
                { scaleX: 0 },
                { scaleX: 1, duration: DURATION.element, ease: EASE.element },
                0.75
            )
            .fromTo('.hero-meta',
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: DURATION.element, ease: EASE.element, stagger: STAGGER.items },
                0.85
            )
            .fromTo('.hero-cue',
                { opacity: 0 },
                { opacity: 1, duration: DURATION.element, ease: EASE.element },
                1.2
            )

        // Scroll cue breathes so the hero never sits completely still.
        gsap.to('.hero-cue-arrow', {
            y: 6,
            duration: 1.1,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: HERO_START + 1.4
        })

        // Depth on exit: plate drifts down, name drifts up, at different rates.
        gsap.to(plateInnerRef.current, {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true }
        })

        gsap.to(nameRef.current, {
            yPercent: -18,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true }
        })
    }, { scope: sectionRef, dependencies: [lang] })

    return (
        <section
            ref={sectionRef}
            id='hero'
            className='bg-grain relative flex h-svh flex-col justify-end overflow-hidden bg-background'
        >
            <div ref={plateRef} className='absolute -inset-8 will-change-transform'>
              <div ref={plateInnerRef} className='absolute inset-0 will-change-transform'>
                <img
                    src={HERO_STILL}
                    alt=''
                    aria-hidden='true'
                    fetchPriority='high'
                    className='h-full w-full object-cover opacity-40 grayscale-[0.7]'
                />
                <div
                    aria-hidden='true'
                    className='absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40'
                />
                {/* Crimson bloom, low opacity — colour in the frame without tinting the whole plate. */}
                <div
                    aria-hidden='true'
                    className='absolute -left-1/4 top-1/4 h-[60vh] w-[60vh] rounded-full bg-primary/12 blur-[120px]'
                />
              </div>
            </div>

            <div className='relative grid gap-10 px-6 pb-[clamp(2.5rem,7vh,5rem)] lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16 lg:px-12'>
                <div className='flex flex-col gap-6'>
                    <h1
                        ref={nameRef}
                        className='type-display flex flex-col text-[clamp(3.5rem,15vw,13rem)] text-foreground will-change-transform'
                    >
                        <SplitChars text='Drilon' />
                        <SplitChars text='Hoxha' />
                    </h1>

                    <div className='hero-rule h-px w-full origin-left bg-primary' />

                    <p className='hero-meta max-w-[46ch] text-base leading-relaxed text-foreground/65'>
                        {t.hero.intro}
                    </p>
                </div>

                {/* Numbered role column — the production-sheet register, echoed
                    from the film cards. */}
                <ul className='flex flex-col gap-2.5 lg:items-end'>
                    {roles.map((role, index) => (
                        <li key={role} className='hero-meta flex items-center gap-3'>
                            <span className='type-meta text-primary-bright'>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className='type-meta text-foreground/80'>{role}</span>
                        </li>
                    ))}

                    <li className='hero-meta mt-4 flex items-center gap-3 border-t border-border pt-4'>
                        <span className='type-meta text-foreground/40'>
                            {brand.company} — EST. {brand.companyFounded}
                        </span>
                    </li>
                </ul>
            </div>

            <div className='hero-cue relative flex items-center gap-3 px-6 pb-6 lg:px-12'>
                <span className='hero-cue-arrow flex size-9 items-center justify-center rounded-full border border-border text-foreground/50'>
                    <ArrowDown className='size-3.5' />
                </span>
                <span className='type-meta text-foreground/35'>{t.hero.scroll}</span>
            </div>
        </section>
    )
}
