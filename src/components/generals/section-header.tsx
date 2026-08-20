import type { FC, ReactNode } from 'react'

import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { DURATION, EASE, TRIGGER_START } from '@/constants/motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
    /** Reel-style index, e.g. '02'. */
    index: string
    eyebrow: string
    className?: string
}

/**
 * The numbered eyebrow at the top of every section — the thread that makes the
 * page read as one production sheet rather than stacked blocks.
 *
 * It animates itself rather than relying on each section to target it: the
 * rule draws out from the left and the label follows, so every section opens
 * with the same beat.
 */
export const SectionHeader: FC<SectionHeaderProps> = ({ index, eyebrow, className }): ReactNode => {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const timeline = gsap.timeline({
            scrollTrigger: { trigger: ref.current, start: TRIGGER_START.standard }
        })

        timeline
            .fromTo('.header-index', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: DURATION.element, ease: EASE.element })
            .fromTo('.header-rule', { scaleX: 0 }, { scaleX: 1, duration: DURATION.element, ease: EASE.element }, '-=0.35')
            .fromTo('.header-label', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: DURATION.element, ease: EASE.element }, '-=0.3')
    }, { scope: ref })

    return (
        <div ref={ref} className={cn('flex items-center gap-4', className)}>
            <span className='header-index type-meta text-primary-bright'>{index}</span>
            <span aria-hidden='true' className='header-rule h-px w-12 origin-left bg-primary' />
            <span className='header-label type-meta text-foreground/55'>{eyebrow}</span>
        </div>
    )
}
