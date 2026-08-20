import type { RefObject } from 'react'

import { useEffect } from 'react'

import { gsap } from '@/lib/gsap'

/**
 * Attaches a magnetic-pull hover effect to an element: it eases toward
 * the cursor while hovered and springs back to rest on mouseleave.
 */
export const useMagnetic = <T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.35) => {
    useEffect(() => {
        const el = ref.current
        if (!el || strength === 0) return
        if (window.matchMedia('(pointer: coarse)').matches) return

        const handleMouseMove = (event: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const relX = event.clientX - (rect.left + rect.width / 2)
            const relY = event.clientY - (rect.top + rect.height / 2)

            gsap.to(el, {
                x: relX * strength,
                y: relY * strength,
                duration: 0.4,
                ease: 'power3.out'
            })
        }

        const handleMouseLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
            })
        }

        el.addEventListener('mousemove', handleMouseMove)
        el.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            el.removeEventListener('mousemove', handleMouseMove)
            el.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [ref, strength])
}
