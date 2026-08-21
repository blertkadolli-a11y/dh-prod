import type { FC, ReactNode } from 'react'

import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { MobileMenu } from '@/components/sections/mobile-menu'
import { LangToggle } from '@/components/film/lang-toggle'
import { useLanguage } from '@/context/language'
import { navLinks } from '@/constants/navigation'
import { brand } from '@/constants/site'
import { cn } from '@/lib/utils'

export const Navbar: FC = (): ReactNode => {
    const { t } = useLanguage()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const headerRef = useRef<HTMLElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80)

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1024px)')
        const handle = (event: MediaQueryListEvent) => {
            if (event.matches) setMenuOpen(false)
        }

        desktop.addEventListener('change', handle)

        return () => desktop.removeEventListener('change', handle)
    }, [])

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        // Read-through progress for the whole document.
        gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.4
            }
        })
    }, { scope: headerRef })

    return (
        <>
        <header
            ref={headerRef}
            className={cn(
                'fixed inset-x-0 top-0 z-[90] transition-colors duration-500',
                scrolled && 'bg-background/85 backdrop-blur-md'
            )}
        >
            <div className='flex items-center justify-between gap-6 px-6 py-4 lg:px-12'>
                <a
                    href='#hero'
                    data-cursor-hover
                    aria-label={brand.company}
                    className='flex shrink-0 items-center py-2 transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    <img
                        src='/logo.png'
                        alt={brand.company}
                        width={700}
                        height={311}
                        className='h-9 w-auto lg:h-11'
                    />
                </a>

                <nav className='hidden items-center gap-8 lg:flex'>
                    {navLinks.map(link => (
                        <a
                            key={link.key}
                            href={link.href}
                            data-cursor-hover
                            className='nav-link group type-meta relative text-foreground/55 transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                        >
                            {t.nav[link.key]}
                            {/* Underline draws in from the left on hover. */}
                            <span
                                aria-hidden='true'
                                className='absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100'
                            />
                        </a>
                    ))}
                </nav>

                <div className='flex items-center gap-2'>
                    <LangToggle />

                    {/* Below lg the desktop nav is hidden, so this is the only
                        route to any section. */}
                    <button
                        type='button'
                        onClick={() => setMenuOpen(value => !value)}
                        aria-expanded={menuOpen}
                        aria-controls='mobile-menu'
                        aria-label={menuOpen ? t.ui.close : t.ui.open}
                        className='relative z-[130] flex size-12 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 hover:border-primary focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none lg:hidden'
                    >
                        {menuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
                    </button>
                </div>
            </div>

            {/* Scroll progress — the only always-on motion in the chrome. */}
            <div className='relative h-px w-full bg-border/60'>
                <div ref={progressRef} className='h-full w-full origin-left scale-x-0 bg-primary' />
            </div>

        </header>

        {/* Sibling of <header>, deliberately — see note above. */}
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    )
}
