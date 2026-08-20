import type { FC, ReactNode } from 'react'

import { useRef } from 'react'

import { cn } from '@/lib/utils'
import { gsap, useGSAP } from '@/lib/gsap'
import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

interface RevealImageProps {
    src: string
    alt: string
    className?: string
    imgClassName?: string
    /** Position within a row of images — offsets the reveal by STAGGER.images so a row cascades. */
    index?: number
}

/**
 * Premium image reveal. Two things animate together on scroll:
 *  1. the wrapper clips open left -> right (inset right 100% -> 0%), wiping the image in.
 *  2. the image scales 1.15 -> 1 at the same time, for a depth pull.
 * Both run 1s on power3.out, triggered when the wrapper hits 85% of the viewport.
 * Pass `index` for a row so each image cascades by STAGGER.images (0.12s).
 */
export const RevealImage: FC<RevealImageProps> = ({
    src,
    alt,
    className,
    imgClassName,
    index = 0
}): ReactNode => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    useGSAP(() => {
        // Reduced motion: leave the image fully revealed at its resting state.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.set(wrapperRef.current, { clipPath: 'inset(0 100% 0 0)' })
        gsap.set(imgRef.current, { scale: 1.15 })

        const timeline = gsap.timeline({
            delay: index * STAGGER.images,
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: TRIGGER_START.standard
            }
        })

        timeline
            .to(wrapperRef.current, {
                clipPath: 'inset(0 0% 0 0)',
                duration: DURATION.image,
                ease: EASE.element
            })
            .to(imgRef.current, {
                scale: 1,
                duration: DURATION.image,
                ease: EASE.element
            }, 0)
    }, { scope: wrapperRef })

    return (
        <div ref={wrapperRef} className={cn('overflow-hidden', className)}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={cn('h-full w-full object-cover will-change-transform', imgClassName)}
            />
        </div>
    )
}
