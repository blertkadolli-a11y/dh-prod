import type { FC, ReactNode } from 'react'

import { useEffect, useState } from 'react'

import { useLanguage } from '@/context/language'
import { navLinks } from '@/constants/navigation'
import { cn } from '@/lib/utils'

/**
 * Fixed reel rail. Shows where you are in the page and lets you jump.
 *
 * Uses IntersectionObserver rather than ScrollTrigger: this only needs to know
 * which section owns the middle of the viewport, and an observer does that
 * without adding another trigger to the scroll pipeline that the pinned
 * filmography already drives.
 */
export const SectionRail: FC = (): ReactNode => {
    const { t } = useLanguage()
    const [active, setActive] = useState<string>(navLinks[0].href)

    useEffect(() => {
        const sections = navLinks
            .map(link => document.querySelector(link.href))
            .filter((el): el is Element => Boolean(el))

        if (sections.length === 0) return

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

                if (visible) setActive(`#${visible.target.id}`)
            },
            // A band across the middle of the viewport, so the active item
            // changes when a section actually takes over the screen.
            { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
        )

        sections.forEach(section => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    return (
        <nav
            aria-label='Section navigation'
            className='pointer-events-none fixed top-1/2 right-6 z-[85] hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex'
        >
            {navLinks.map((link, index) => {
                const current = active === link.href

                return (
                    <a
                        key={link.key}
                        href={link.href}
                        data-cursor-hover
                        className='group pointer-events-auto flex items-center gap-3 focus-visible:outline-none'
                    >
                        <span
                            className={cn(
                                'type-meta text-[0.6rem] transition-all duration-500',
                                current
                                    ? 'text-primary-bright opacity-100'
                                    : 'text-foreground/35 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                            )}
                        >
                            {t.nav[link.key]}
                        </span>

                        {/* The number is hidden at rest. Shown always, it read as a
                            second numbered list competing with the hero's role
                            column; as bare rules the rail reads as a scrubber. */}
                        <span
                            className={cn(
                                'type-meta text-[0.6rem] tabular-nums transition-all duration-500',
                                current
                                    ? 'text-primary-bright opacity-100'
                                    : 'text-foreground/30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                            )}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* The rule grows when its section owns the viewport. */}
                        <span
                            aria-hidden='true'
                            className={cn(
                                'h-px origin-right transition-all duration-500 ease-out',
                                current ? 'w-8 bg-primary' : 'w-3 bg-foreground/25 group-hover:w-6'
                            )}
                        />
                    </a>
                )
            })}
        </nav>
    )
}
