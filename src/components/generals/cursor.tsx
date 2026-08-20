import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { gsap } from '@/lib/gsap'

/**
 * Two-part cursor: a tight dot that tracks precisely, and a ring that lags
 * behind it. The offset between them is what makes the movement read as
 * weighted rather than glued to the pointer.
 *
 * Two things this must get right, both of which the first version got wrong:
 *
 *  1. It sits above EVERYTHING (z-300). `cursor: none` hides the native
 *     pointer document-wide, so if the custom cursor is painted under a modal
 *     the user is left with no pointer at all.
 *  2. Hover targets are matched by delegation, not by a querySelectorAll at
 *     mount. Anything rendered later — the whole checkout modal — would
 *     otherwise never react.
 */
export const Cursor: FC = (): ReactNode => {
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const labelRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        const label = labelRef.current

        const canUseCustomCursor = window.matchMedia('(pointer: fine)').matches
            && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (!dot || !ring || !label || !canUseCustomCursor) return

        document.documentElement.classList.add('cursor-active')
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })
        gsap.set(ring, { opacity: 0.55 })

        const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
        const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
        const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3' })
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3' })

        const handleMove = (event: MouseEvent) => {
            dotX(event.clientX); dotY(event.clientY)
            ringX(event.clientX); ringY(event.clientY)
        }

        let active: HTMLElement | null = null

        const enter = (target: HTMLElement) => {
            active = target
            const text = target.dataset.cursorLabel ?? ''

            label.textContent = text
            gsap.to(ring, {
                scale: text ? 3.4 : 2.6,
                opacity: 1,
                borderColor: 'var(--primary)',
                backgroundColor: text ? 'var(--primary)' : 'transparent',
                duration: 0.34,
                ease: 'power3.out'
            })
            gsap.to(dot, { scale: 0, duration: 0.28, ease: 'power3.out' })
            gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.24, ease: 'power2.out' })
        }

        const leave = () => {
            active = null
            gsap.to(ring, {
                scale: 1,
                opacity: 0.55,
                borderColor: 'rgba(237,234,228,0.6)',
                backgroundColor: 'transparent',
                duration: 0.34,
                ease: 'power3.out'
            })
            gsap.to(dot, { scale: 1, duration: 0.28, ease: 'power3.out' })
            gsap.to(label, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' })
        }

        // Delegated, so elements mounted after this effect still work.
        const handleOver = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor-hover]')
            if (target && target !== active) enter(target)
        }

        const handleOut = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor-hover]')
            const next = (event.relatedTarget as HTMLElement | null)?.closest?.('[data-cursor-hover]')
            if (target && target === active && next !== target) leave()
        }

        // Hide entirely when the pointer leaves the window, so it never sits
        // frozen in a corner.
        const handleWindowOut = (event: MouseEvent) => {
            if (event.relatedTarget === null) gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
        }
        const handleWindowIn = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 })

        window.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseover', handleOver)
        document.addEventListener('mouseout', handleOut)
        document.addEventListener('mouseout', handleWindowOut)
        document.addEventListener('mouseover', handleWindowIn)

        return () => {
            document.documentElement.classList.remove('cursor-active')
            window.removeEventListener('mousemove', handleMove)
            document.removeEventListener('mouseover', handleOver)
            document.removeEventListener('mouseout', handleOut)
            document.removeEventListener('mouseout', handleWindowOut)
            document.removeEventListener('mouseover', handleWindowIn)
        }
    }, [])

    return (
        <>
            <div
                ref={dotRef}
                aria-hidden='true'
                className='pointer-events-none fixed top-0 left-0 z-[300] hidden size-1.5 rounded-full bg-foreground will-change-transform lg:block'
            />

            <div
                ref={ringRef}
                aria-hidden='true'
                className='pointer-events-none fixed top-0 left-0 z-[300] hidden size-9 items-center justify-center rounded-full border border-foreground/60 will-change-transform lg:flex'
            >
                <span
                    ref={labelRef}
                    className='type-meta invisible text-[0.3rem] whitespace-nowrap text-primary-foreground opacity-0'
                />
            </div>
        </>
    )
}
