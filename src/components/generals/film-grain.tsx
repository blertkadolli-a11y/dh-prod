import type { FC, ReactNode } from 'react'

/**
 * Full-page grain and vignette.
 *
 * Sits above the content but below the chrome (navbar 90, modals 150, cursor
 * 300) and never takes pointer events. This is the single cheapest thing that
 * makes a dark site read as film rather than as a web page: it breaks up flat
 * charcoal gradients and stops large areas of pure background from banding.
 *
 * The noise is an inline SVG turbulence filter — no network request, no image
 * decode, and it scales to any viewport.
 */
export const FilmGrain: FC = (): ReactNode => {
    return (
        <div aria-hidden='true' className='pointer-events-none fixed inset-0 z-[70]'>
            {/* Vignette: pulls the eye to centre and darkens the frame edges. */}
            <div
                className='absolute inset-0'
                style={{
                    background:
                        'radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.55) 100%)'
                }}
            />

            {/* Grain. Kept very low opacity — visible as texture, never as noise. */}
            <div
                className='absolute inset-0 opacity-[0.055] mix-blend-overlay'
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Faint horizontal scanlines — projector texture, not CRT. */}
            <div
                className='absolute inset-0 opacity-[0.035]'
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(to bottom, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 1px, transparent 1px, transparent 3px)'
                }}
            />
        </div>
    )
}
