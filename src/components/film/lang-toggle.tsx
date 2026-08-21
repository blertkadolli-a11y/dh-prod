import type { FC, ReactNode } from 'react'

import { useLanguage } from '@/context/language'
import { cn } from '@/lib/utils'

const langs = ['sq', 'en'] as const

export const LangToggle: FC = (): ReactNode => {
    const { lang, t, toggle } = useLanguage()

    return (
        <button
            type='button'
            data-cursor-hover
            onClick={toggle}
            aria-label={t.ui.langLabel}
            className='group relative flex cursor-pointer items-center rounded-full border border-border p-1 transition-colors duration-300 hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
        >
            {/* Crimson pill slides between the two labels. */}
            <span
                aria-hidden='true'
                className={cn(
                    'absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    lang === 'en' && 'translate-x-full'
                )}
            />

            {langs.map(code => (
                <span
                    key={code}
                    className={cn(
                        'type-meta relative z-10 flex items-center px-3.5 py-2.5 transition-colors duration-300',
                        lang === code ? 'text-primary-foreground' : 'text-foreground/45'
                    )}
                >
                    {code.toUpperCase()}
                </span>
            ))}
        </button>
    )
}
