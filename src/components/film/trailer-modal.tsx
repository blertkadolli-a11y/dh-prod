import type { FC, ReactNode } from 'react'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/components/generals/smooth-scroll-provider'
import { useLanguage } from '@/context/language'
import { embedUrl } from '@/lib/youtube'
import { DURATION, EASE } from '@/constants/motion'

interface TrailerModalProps {
    videoId: string
    title: string
    onClose: () => void
}

export const TrailerModal: FC<TrailerModalProps> = ({ videoId, title, onClose }): ReactNode => {
    const { t } = useLanguage()
    const lenis = useLenis()
    const overlayRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<HTMLDivElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)

    // Scroll lock + focus handoff. Lenis drives scrolling, so `overflow: hidden`
    // alone would not stop it — the instance has to be told to stop too.
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null

        document.body.classList.add('modal-open')
        lenis?.stop()
        closeRef.current?.focus()

        return () => {
            document.body.classList.remove('modal-open')
            lenis?.start()
            // Return focus to the card that opened the modal so keyboard users
            // are not dumped back at the top of the document.
            previouslyFocused?.focus?.()
        }
    }, [lenis])

    // Esc to close, and a minimal focus trap: with only one focusable control
    // in the dialog, cycling Tab back onto it is sufficient containment.
    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
                return
            }

            if (event.key === 'Tab') {
                event.preventDefault()
                closeRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKey)

        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(overlayRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: DURATION.exit, ease: EASE.enter }
        )

        gsap.fromTo(frameRef.current,
            { autoAlpha: 0, scale: 0.96 },
            { autoAlpha: 1, scale: 1, duration: DURATION.element, ease: EASE.element }
        )
    }, { scope: overlayRef })

    return (
        <div
            ref={overlayRef}
            role='dialog'
            aria-modal='true'
            aria-label={title}
            onClick={onClose}
            className='fixed inset-0 z-[150] flex items-center justify-center bg-black/92 px-4 backdrop-blur-sm'
        >
            <button
                ref={closeRef}
                type='button'
                onClick={onClose}
                aria-label={t.ui.close}
                className='absolute top-5 right-5 z-10 flex size-14 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-[background-color,border-color,transform] duration-300 ease-out hover:scale-110 hover:border-primary hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'
            >
                <X className='size-5' />
            </button>

            <div
                ref={frameRef}
                onClick={event => event.stopPropagation()}
                className='aspect-video w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-2xl'
            >
                <iframe
                    src={embedUrl(videoId)}
                    title={title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='h-full w-full border-0'
                />
            </div>
        </div>
    )
}
