import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { DURATION, EASE } from '@/constants/motion'
import { films } from '@/constants/films'
import { brand } from '@/constants/site'

/**
 * Hard ceiling on how long the intro may hold the page. GSAP runs on
 * requestAnimationFrame, which browsers throttle or pause in a backgrounded
 * tab — so an intro that only releases the scroll lock in its onComplete can
 * leave the site permanently unscrollable if it stalls. This timeout lives on
 * the macrotask queue, which keeps firing when rAF does not.
 */
const FAILSAFE_MS = 7000

/** Seconds each title holds on screen during the leader sequence. */
const TITLE_HOLD = 0.16

const unlockScroll = () => {
    document.documentElement.style.overflow = ''
}

export const Preloader: FC = (): ReactNode => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const barTopRef = useRef<HTMLDivElement>(null)
    const barBottomRef = useRef<HTMLDivElement>(null)
    const markRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const failsafe = window.setTimeout(() => {
            unlockScroll()
            if (overlayRef.current) {
                gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
            }
        }, FAILSAFE_MS)

        return () => {
            window.clearTimeout(failsafe)
            unlockScroll()
        }
    }, [])

    useGSAP(() => {
        // Reduced motion: never hold the page behind an intro.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
            unlockScroll()

            return
        }

        document.documentElement.style.overflow = 'hidden'

        const titles = gsap.utils.toArray<HTMLElement>('.leader-title')

        const timeline = gsap.timeline({ onComplete: unlockScroll })

        gsap.set(titles, { autoAlpha: 0, yPercent: 30 })
        gsap.set(markRef.current, { autoAlpha: 0, scale: 0.92 })

        // 1. Leader: each title punches in and cuts out, like a film countdown.
        titles.forEach((title, index) => {
            timeline
                .to(title, { autoAlpha: 1, yPercent: 0, duration: 0.18, ease: EASE.element }, index * TITLE_HOLD)
                .to(title, { autoAlpha: 0, duration: 0.1, ease: EASE.exit }, index * TITLE_HOLD + TITLE_HOLD * 0.72)
        })

        const leaderEnd = titles.length * TITLE_HOLD + 0.1

        // 2. The mark resolves out of the cuts.
        timeline.to(markRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: DURATION.element,
            ease: EASE.element
        }, leaderEnd)

        // 3. A crimson rule draws under it.
        timeline.fromTo(lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: DURATION.element, ease: EASE.element },
            leaderEnd + 0.1
        )

        // 4. Letterbox bars split apart and the overlay lifts with them.
        timeline
            .to(markRef.current, { autoAlpha: 0, duration: 0.3, ease: EASE.exit }, leaderEnd + 0.85)
            .to(lineRef.current, { scaleX: 0, duration: 0.3, ease: EASE.exit, transformOrigin: 'right center' }, leaderEnd + 0.85)
            .to(barTopRef.current, { yPercent: -100, duration: DURATION.text, ease: EASE.reveal }, leaderEnd + 1.05)
            .to(barBottomRef.current, { yPercent: 100, duration: DURATION.text, ease: EASE.reveal }, leaderEnd + 1.05)
            .set(overlayRef.current, { autoAlpha: 0, pointerEvents: 'none' })
    }, { scope: overlayRef })

    return (
        <div
            ref={overlayRef}
            aria-hidden='true'
            className='pointer-events-none fixed inset-0 z-[200]'
        >
            <div ref={barTopRef} className='absolute inset-x-0 top-0 h-1/2 bg-background will-change-transform' />
            <div ref={barBottomRef} className='absolute inset-x-0 bottom-0 h-1/2 bg-background will-change-transform' />

            <div className='absolute inset-0 flex flex-col items-center justify-center gap-5'>
                {/* Leader: the filmography flashing past, stacked in one slot. */}
                <div className='relative flex h-[clamp(2rem,6vw,4rem)] items-center justify-center'>
                    {films.map(film => (
                        <span
                            key={film.slug}
                            className='leader-title type-display absolute whitespace-nowrap text-[clamp(1.5rem,5vw,3.25rem)] text-foreground/70'
                        >
                            {film.title}
                        </span>
                    ))}

                    <div ref={markRef} className='flex flex-col items-center gap-3'>
                        <span className='type-display text-[clamp(1.75rem,6vw,4rem)] text-foreground'>
                            {brand.name}
                        </span>
                        <span className='type-meta text-foreground/40'>{brand.company}</span>
                    </div>
                </div>

                <div ref={lineRef} className='h-px w-[min(60vw,22rem)] origin-left scale-x-0 bg-primary' />
            </div>
        </div>
    )
}
