import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface SplitLinesProps {
    lines: string[]
    className?: string
    lineClassName?: string
    innerClassName?: string
}

/**
 * Wraps each line in an overflow-hidden mask with an inner span, the
 * shape ScrollTrigger line-reveal animations need (animate the inner
 * span's y/opacity, the wrapper masks the motion).
 */
export const SplitLines: FC<SplitLinesProps> = ({
    lines,
    className,
    lineClassName,
    innerClassName
}): ReactNode => {
    return (
        <span className={cn('block', className)}>
            {lines.map((line, index) => (
                <span
                    key={index}
                    className={cn('line-wrapper block overflow-hidden', lineClassName)}
                >
                    <span className={cn('line-inner block will-change-transform', innerClassName)}>
                        {line}
                    </span>
                </span>
            ))}
        </span>
    )
}
