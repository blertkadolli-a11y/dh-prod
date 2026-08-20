import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

import { useRef } from 'react'

import { useMagnetic } from '@/hooks/use-magnetic'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost'

interface ActionProps extends ComponentPropsWithoutRef<'a'> {
    as?: 'a' | 'button'
    variant?: Variant
    icon?: ReactNode
    children: ReactNode
    /** Disables the magnetic pull — use inside horizontally-scrolling tracks. */
    still?: boolean
}

const base =
    'group/act relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full ' +
    'px-7 py-4 will-change-transform focus-visible:ring-2 focus-visible:ring-primary-bright ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none'

const shell: Record<Variant, string> = {
    primary: 'bg-primary text-primary-foreground',
    outline: 'border border-border text-foreground',
    ghost: 'text-foreground'
}

/**
 * The one interactive control on the site.
 *
 * Three things move on hover, and none of them touch layout:
 *  1. a crimson (or bone) disc wipes up from the bottom via scaleY,
 *  2. the label pair slides up so a duplicate takes its place,
 *  3. the whole control eases toward the cursor (magnetic).
 */
export const Action: FC<ActionProps> = ({
    as = 'a',
    variant = 'primary',
    icon,
    children,
    className,
    still = false,
    ...rest
}): ReactNode => {
    const ref = useRef<HTMLAnchorElement>(null)

    useMagnetic(ref, still ? 0 : 0.22)

    const Tag = as as 'a'
    const typeAttr = as === 'button' ? { type: 'button' as const } : {}

    return (
        <Tag
            ref={ref}
            data-cursor-hover
            className={cn(base, shell[variant], className)}
            {...typeAttr}
            {...rest}
        >
            {/* Fill wipe. transform-only, so it never triggers layout. */}
            <span
                aria-hidden='true'
                className={cn(
                    'absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/act:scale-y-100',
                    variant === 'primary' ? 'bg-foreground' : 'bg-primary'
                )}
            />

            {icon && (
                <span
                    className={cn(
                        'relative z-10 flex items-center transition-colors duration-300',
                        variant === 'primary'
                            ? 'group-hover/act:text-background'
                            : 'group-hover/act:text-primary-foreground'
                    )}
                >
                    {icon}
                </span>
            )}

            {/* Label pair: the visible line rises out, the clone rises in. */}
            <span className='relative z-10 block overflow-hidden'>
                <span
                    className={cn(
                        'type-meta block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/act:-translate-y-full'
                    )}
                >
                    {children}
                </span>
                <span
                    aria-hidden='true'
                    className={cn(
                        'type-meta absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/act:translate-y-0',
                        variant === 'primary' ? 'text-background' : 'text-primary-foreground'
                    )}
                >
                    {children}
                </span>
            </span>
        </Tag>
    )
}
