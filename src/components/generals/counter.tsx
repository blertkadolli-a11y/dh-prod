import type { FC, ReactNode } from 'react'

import { useEffect, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { DURATION, EASE, TRIGGER_START } from '@/constants/motion'

interface CounterProps {
    value: number
    suffix?: string
}

/**
 * Counts up once when the stat scrolls into view.
 *
 * These numbers are the sponsor pitch, so correctness beats motion: a count-up
 * that stalls mid-run (rAF is paused in backgrounded tabs) would leave a
 * partial figure like "26K" on screen where the real number is "340K". A
 * timeout on the macrotask queue writes the true value regardless of whether
 * the tween ever finished.
 */
export const Counter: FC<CounterProps> = ({ value, suffix = '' }): ReactNode => {
    const ref = useRef<HTMLSpanElement>(null)
    const final = `${value}${suffix}`

    useEffect(() => {
        const settle = window.setTimeout(() => {
            if (ref.current) ref.current.textContent = final
        }, DURATION.counter * 1000 + 4000)

        return () => window.clearTimeout(settle)
    }, [final])

    useGSAP(() => {
        const el = ref.current
        if (!el) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.textContent = final

            return
        }

        const counter = { value: 0 }

        gsap.to(counter, {
            value,
            duration: DURATION.counter,
            ease: EASE.counter,
            snap: { value: 1 },
            scrollTrigger: {
                trigger: el,
                start: TRIGGER_START.counter,
                once: true
            },
            onUpdate: () => {
                el.textContent = `${Math.round(counter.value)}${suffix}`
            },
            // Write the exact string rather than trusting the last tick.
            onComplete: () => {
                el.textContent = final
            }
        })
    }, { scope: ref, dependencies: [value, suffix] })

    // Rendered with the final value so it is correct before JS runs.
    return <span ref={ref}>{final}</span>
}
