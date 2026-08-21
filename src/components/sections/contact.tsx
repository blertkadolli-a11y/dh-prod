import type { FC, ReactNode } from 'react'

import { ArrowUpRight, Instagram, Youtube } from 'lucide-react'
import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { SectionHeader } from '@/components/generals/section-header'
import { sectionIndex } from '@/constants/sections'
import { Action } from '@/components/ui/action'
import { useMagnetic } from '@/hooks/use-magnetic'
import { useParallax } from '@/hooks/use-parallax'
import { useLanguage } from '@/context/language'
import { brand } from '@/constants/site'

import { DURATION, EASE, STAGGER, TRIGGER_START } from '@/constants/motion'

const socials = [
    { key: 'instagram', href: brand.social.instagram, Icon: Instagram, label: 'Instagram' },
    { key: 'youtube', href: brand.social.youtube, Icon: Youtube, label: 'YouTube' }
]

export const Contact: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    useParallax(titleRef, { from: 9, to: -9 })
    const emailRef = useRef<HTMLAnchorElement>(null)

    useMagnetic(emailRef, 0.18)

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo('.contact-item',
            { y: 28, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: DURATION.element,
                ease: EASE.element,
                stagger: STAGGER.items,
                scrollTrigger: { trigger: sectionRef.current, start: TRIGGER_START.standard }
            }
        )
    }, { scope: sectionRef, dependencies: [lang] })

    return (
        <section
            ref={sectionRef}
            id='kontakt'
            className='bg-grain relative border-t border-border bg-background px-6 py-[clamp(4rem,14vh,10rem)] lg:px-12'
        >
            <SectionHeader index={sectionIndex('contact')} eyebrow={t.contact.eyebrow} className='contact-item' />

            <div className='mt-10 flex flex-col gap-10'>
                <h2 ref={titleRef} className='contact-item type-display text-[clamp(3rem,11vw,9rem)] text-foreground'>
                    {t.contact.title}
                </h2>

                <p className='contact-item max-w-[44ch] text-base leading-relaxed text-foreground/60'>
                    {t.contact.body}
                </p>

                <a
                    ref={emailRef}
                    href={`mailto:${brand.email}`}
                    data-cursor-hover
                    className='contact-item type-title flex min-h-11 w-fit max-w-full cursor-pointer items-center break-all border-b border-primary pb-2 text-[clamp(1.1rem,3vw,2.25rem)] text-foreground transition-colors duration-300 hover:text-primary-bright focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    {brand.email}
                </a>

                <div className='contact-item'>
                    <Action
                        href='/partneritet'
                        variant='outline'
                        icon={<ArrowUpRight className='size-4' />}
                    >
                        {t.media.cta}
                    </Action>
                </div>

                <div className='contact-item flex flex-col gap-4'>
                    <span className='type-meta text-foreground/35'>{t.contact.follow}</span>

                    <ul className='flex items-center gap-4'>
                        {socials.map(({ key, href, Icon, label }) => (
                            <li key={key}>
                                <a
                                    href={href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    data-cursor-hover
                                    aria-label={label}
                                    className='flex size-14 cursor-pointer items-center justify-center rounded-full border border-border text-foreground/70 transition-[color,border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                                >
                                    <Icon className='size-5' />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
