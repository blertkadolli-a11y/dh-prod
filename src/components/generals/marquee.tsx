import type { FC, ReactNode } from 'react'

import { useRef } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface MarqueeProps {
    items: string[]
    /** Seconds for one full pass at rest. Larger is slower. */
    speed?: number
    className?: string
}

/**
 * Title ticker that reacts to scroll.
 *
 * At rest it drifts at a constant speed — `ease: 'none'` is deliberate, since
 * the no-linear-easing rule applies to entrances, not loops, which must not
 * visibly accelerate at the seam. Scrolling then drives its timeScale, so the
 * band surges with the page and eases back to its resting speed. This is what
 * ties it to the scroll instead of leaving it looping obliviously.
 */
export const Marquee: FC<MarqueeProps> = ({ items, speed = 28, className }): ReactNode => {
    const trackRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        // The list is rendered twice; travelling exactly -50% lands the copy
        // where the original began, so the wrap is invisible.
        const loop = gsap.to(trackRef.current, {
            xPercent: -50,
            duration: speed,
            ease: 'none',
            repeat: -1
        })

        const decay = gsap.quickTo(loop, 'timeScale', { duration: 0.6, ease: 'power3.out' })

        const trigger = ScrollTrigger.create({
            onUpdate: self => {
                // Clamped: a fast flick should feel lively, not tear.
                const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 4)

                // Direction follows the scroll, so the band reverses on the way up.
                loop.timeScale(self.direction === -1 ? -boost : boost)
                decay(self.direction === -1 ? -1 : 1)
            }
        })

        return () => trigger.kill()
    }, { scope: trackRef, dependencies: [items.join('|'), speed] })

    const run = [...items, ...items]

    return (
        <div
            aria-hidden='true'
            className={cn('relative flex overflow-hidden border-y border-border py-5', className)}
        >
            <div ref={trackRef} className='flex w-max shrink-0 items-center will-change-transform'>
                {run.map((item, index) => (
                    <span key={`${item}-${index}`} className='flex items-center'>
                        <span className='type-title px-8 text-[clamp(1.25rem,2.4vw,2rem)] text-foreground/25'>
                            {item}
                        </span>
                        <span className='size-1.5 shrink-0 rounded-full bg-primary' />
                    </span>
                ))}
            </div>
        </div>
    )
}
