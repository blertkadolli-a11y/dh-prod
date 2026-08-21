import type { FC, ReactNode } from 'react'

import { useRef, useState } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeader } from '@/components/generals/section-header'
import { sectionIndex } from '@/constants/sections'
import { SplitLines } from '@/components/generals/split-lines'
import { TrailerModal } from '@/components/film/trailer-modal'
import { FilmCard } from '@/components/film/film-card'
import { useLanguage } from '@/context/language'
import { films } from '@/constants/films'

import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

interface ActiveTrailer {
    videoId: string
    title: string
}

export const Filmography: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState<ActiveTrailer | null>(null)

    useGSAP(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        const lines = gsap.utils.toArray<HTMLElement>('.film-line-inner')

        gsap.set(lines, { y: '100%', opacity: 0 })
        gsap.to(lines, {
            y: '0%',
            opacity: 1,
            duration: DURATION.text,
            ease: EASE.reveal,
            stagger: STAGGER.lines,
            scrollTrigger: { trigger: section, start: TRIGGER_START.standard }
        })

        const media = gsap.matchMedia()

        // The pin is desktop-only and motion-gated. On touch, hijacking vertical
        // scroll to drive a horizontal track fights the user's gesture; below lg
        // the same cards render as a plain vertical stack instead.
        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const cards = gsap.utils.toArray<HTMLElement>('.film-card')

            // Fires when the track first enters the viewport — well before the pin
            // engages — so every card has finished revealing and is fully opaque by
            // the time horizontal travel starts. Revealing during the pin reads as
            // a stutter.
            gsap.fromTo(cards,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: DURATION.element,
                    ease: EASE.element,
                    stagger: STAGGER.items,
                    scrollTrigger: { trigger: track, start: 'top bottom' }
                }
            )

            // Measured off the section rather than window.innerWidth, which also
            // counts the scrollbar and would over-report the distance — that
            // overshoot is what leaves dead space at the end of the pin.
            const getScrollDistance = () => Math.max(0, track.scrollWidth - section.clientWidth)

            const horizontal = gsap.to(track, {
                x: () => -getScrollDistance(),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${getScrollDistance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: self => {
                        if (progressRef.current) {
                            gsap.set(progressRef.current, { scaleX: self.progress })
                        }
                    }
                }
            })

            // Each still drifts inside its own card as the card crosses the
            // screen. `containerAnimation` is what makes this possible: the
            // cards are moved by a tween, not by the scrollbar, so a normal
            // ScrollTrigger would have nothing to measure against.
            gsap.utils.toArray<HTMLElement>('.card-parallax').forEach(media => {
                gsap.fromTo(media,
                    { xPercent: -6 },
                    {
                        xPercent: 6,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: media,
                            containerAnimation: horizontal,
                            start: 'left right',
                            end: 'right left',
                            scrub: true
                        }
                    }
                )
            })
        })

        // Touch / reduced motion: the cards still reveal, but the track is
        // scrolled by the user rather than by a pin.
        media.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
            gsap.fromTo('.film-card',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: DURATION.element,
                    ease: EASE.element,
                    stagger: STAGGER.items,
                    scrollTrigger: { trigger: track, start: 'top 85%' }
                }
            )
        })
    }, { scope: sectionRef, dependencies: [lang] })

    return (
        <>
            <section
                ref={sectionRef}
                id='filmografia'
                className='relative flex flex-col bg-background lg:h-svh lg:overflow-hidden'
            >
                <div className='shrink-0 px-6 pt-[clamp(3rem,8vh,6rem)] pb-[clamp(1.5rem,4vh,3rem)] lg:px-12'>
                    <div className='flex flex-col gap-4'>
                        <SectionHeader index={sectionIndex('filmography')} eyebrow={t.filmography.eyebrow} />

                        <h2 className='type-display text-[clamp(2.5rem,8vw,7rem)] text-foreground'>
                            <SplitLines
                                lines={t.filmography.titleLines}
                                innerClassName='film-line-inner'
                            />
                        </h2>

                        <span className='type-meta text-foreground/35'>
                            <span className='lg:hidden'>{t.filmography.swipeHint}</span>
                            <span className='hidden lg:inline'>{t.filmography.hint}</span>
                        </span>
                    </div>
                </div>

                {/* Below lg this is a real horizontal scroller with snap, so the
                    films travel sideways exactly as they do on desktop but under
                    the user's own thumb. Hijacking vertical scroll to move a
                    horizontal track fights the gesture on touch, so the pin is
                    desktop-only — the presentation is the same, the input is not. */}
                <div className='no-scrollbar min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-[clamp(2rem,5vh,4rem)] lg:snap-none lg:overflow-visible lg:overscroll-auto'>
                    <div
                        ref={trackRef}
                        className='flex w-max gap-5 px-6 will-change-transform lg:h-full lg:items-center lg:gap-8 lg:px-12'
                    >
                        {films.map((film, index) => (
                            <FilmCard
                                key={film.slug}
                                film={film}
                                index={index}
                                onPlay={(videoId, title) => setActive({ videoId, title })}
                            />
                        ))}
                    </div>
                </div>

                {/* Pin progress. Desktop-only, since it tracks the pinned travel. */}
                <div aria-hidden='true' className='absolute inset-x-0 bottom-0 hidden h-px bg-border lg:block'>
                    <div ref={progressRef} className='h-full origin-left scale-x-0 bg-primary' />
                </div>
            </section>

            {active && (
                <TrailerModal
                    videoId={active.videoId}
                    title={active.title}
                    onClose={() => setActive(null)}
                />
            )}
        </>
    )
}
