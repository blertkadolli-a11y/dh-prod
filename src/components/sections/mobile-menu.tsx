import type { FC, ReactNode } from 'react'

import { Instagram, Youtube } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { useLenis } from '@/components/generals/smooth-scroll-provider'
import { LangToggle } from '@/components/film/lang-toggle'
import { useLanguage } from '@/context/language'
import { navLinks } from '@/constants/navigation'
import { brand } from '@/constants/site'

import { DURATION, EASE, STAGGER } from '@/constants/motion'

interface MobileMenuProps {
    open: boolean
    onClose: () => void
}

/**
 * Full-screen navigation for anything below `lg`.
 *
 * The desktop nav is `hidden lg:flex`, which left phones and tablets with no
 * way to reach any section at all — only the logo and the language toggle were
 * reachable. This is that missing navigation.
 *
 * Sits at z-120: above the grain (70) and rail (85), below the checkout modal
 * (150) so a modal opened from a menu link still covers it, and below the
 * cursor (300).
 */
export const MobileMenu: FC<MobileMenuProps> = ({ open, onClose }): ReactNode => {
    const { t } = useLanguage()
    const lenis = useLenis()
    const panelRef = useRef<HTMLDivElement>(null)

    // Lenis drives scrolling, so `overflow: hidden` alone would not hold it.
    useEffect(() => {
        if (!open) return

        document.body.classList.add('modal-open')
        lenis?.stop()

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKey)

        return () => {
            document.body.classList.remove('modal-open')
            lenis?.start()
            document.removeEventListener('keydown', handleKey)
        }
    }, [open, lenis, onClose])

    useGSAP(() => {
        if (!open) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(panelRef.current,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION.text, ease: EASE.reveal }
        )

        gsap.fromTo('.menu-item',
            { yPercent: 110, opacity: 0 },
            {
                yPercent: 0,
                opacity: 1,
                duration: DURATION.element,
                ease: EASE.reveal,
                stagger: STAGGER.lines,
                delay: 0.12
            }
        )

        gsap.fromTo('.menu-foot',
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: DURATION.element, ease: EASE.element, delay: 0.4 }
        )
    }, { scope: panelRef, dependencies: [open] })

    if (!open) return null

    return (
        <div
            ref={panelRef}
            id='mobile-menu'
            className='bg-grain fixed inset-0 z-[120] flex flex-col justify-between bg-background px-6 pt-24 pb-10 lg:hidden'
        >
            <nav>
                <ul className='flex flex-col gap-1'>
                    {navLinks.map((link, index) => (
                        <li key={link.key} className='overflow-hidden'>
                            <a
                                href={link.href}
                                onClick={onClose}
                                className='menu-item flex items-baseline gap-4 py-3 focus-visible:outline-none'
                            >
                                <span className='type-meta text-[0.6rem] text-primary-bright'>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className='type-display text-[clamp(2.25rem,11vw,3.5rem)] text-foreground'>
                                    {t.nav[link.key]}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className='menu-foot flex flex-col gap-6'>
                <div className='hairline' />

                <div className='flex items-center justify-between gap-4'>
                    <ul className='flex items-center gap-3'>
                        <li>
                            <a
                                href={brand.social.instagram}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='Instagram'
                                className='flex size-12 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors duration-200 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                            >
                                <Instagram className='size-5' />
                            </a>
                        </li>
                        <li>
                            <a
                                href={brand.social.youtube}
                                target='_blank'
                                rel='noopener noreferrer'
                                aria-label='YouTube'
                                className='flex size-12 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors duration-200 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                            >
                                <Youtube className='size-5' />
                            </a>
                        </li>
                    </ul>

                    <LangToggle />
                </div>

                <a
                    href={`mailto:${brand.email}`}
                    className='type-meta break-all py-2 text-foreground/45 transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    {brand.email}
                </a>
            </div>
        </div>
    )
}
