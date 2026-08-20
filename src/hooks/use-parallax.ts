import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

interface ParallaxOptions {
    /** yPercent at the moment the element enters the viewport. */
    from?: number
    /** yPercent as it leaves. */
    to?: number
    /** Higher values lag further behind the scrollbar. */
    scrub?: number | boolean
}

/**
 * Scroll-linked drift on a single element.
 *
 * Deliberately small by default: the point is depth, not movement. Anything
 * past roughly ±15% starts to desync visibly from the content around it and
 * reads as a bug rather than as parallax.
 *
 * Only ever touches yPercent, so it stays on the compositor.
 */
export const useParallax = <T extends HTMLElement>(
    ref: RefObject<T | null>,
    { from = 10, to = -10, scrub = 1 }: ParallaxOptions = {}
) => {
    useGSAP(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(el,
            { yPercent: from },
            {
                yPercent: to,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub
                }
            }
        )
    }, { scope: ref })
}
