import type { FC, ReactNode } from 'react'

import { LangToggle } from '@/components/film/lang-toggle'
import { useLanguage } from '@/context/language'
import { navLinks } from '@/constants/navigation'
import { brand } from '@/constants/site'

export const Footer: FC = (): ReactNode => {
    const { t } = useLanguage()
    const year = new Date().getFullYear()

    return (
        <footer className='border-t border-border bg-background px-6 py-10 lg:px-12'>
            <div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
                <a
                    href='#hero'
                    aria-label={brand.company}
                    data-cursor-hover
                    className='shrink-0 rounded-sm transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    <img
                        src='/logo.png'
                        alt={brand.company}
                        width={700}
                        height={311}
                        loading='lazy'
                        className='h-8 w-auto'
                    />
                </a>

                <nav className='flex flex-wrap items-center gap-x-8 gap-y-3'>
                    {navLinks.map(link => (
                        <a
                            key={link.key}
                            href={link.href}
                            data-cursor-hover
                            className='type-meta text-foreground/45 transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                        >
                            {t.nav[link.key]}
                        </a>
                    ))}
                </nav>

                <LangToggle />
            </div>

            <div className='hairline my-8' />

            <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between'>
                <span className='type-meta text-foreground/35'>
                    © {year} {brand.name}
                </span>
                <span className='type-meta text-foreground/25'>
                    {t.footer.rights}
                </span>
            </div>
        </footer>
    )
}
