import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SplitCharsProps {
    text: string
    className?: string
    charClassName?: string
}

/**
 * Per-character spans for letter-level stagger, wrapped in an overflow mask.
 *
 * The whole string is exposed once via aria-label and every glyph is hidden
 * from the accessibility tree — otherwise screen readers spell the word out
 * one letter at a time.
 */
export const SplitChars: FC<SplitCharsProps> = ({ text, className, charClassName }): ReactNode => {
    return (
        <span className={cn('inline-block overflow-hidden align-bottom', className)} aria-label={text}>
            {Array.from(text).map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    aria-hidden='true'
                    className={cn('char inline-block will-change-transform', charClassName)}
                >
                    {char === ' ' ? ' ' : char}
                </span>
            ))}
        </span>
    )
}
