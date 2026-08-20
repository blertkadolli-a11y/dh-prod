/**
 * Central motion tokens. Every animation in the project should pull its
 * easing, duration, stagger, and trigger values from here instead of
 * hardcoding magic numbers, so the whole site stays choreographed.
 */

export const EASE = {
    reveal: 'power4.out',
    element: 'power3.out',
    stagger: 'expo.out',
    counter: 'power2.out',
    exit: 'power2.in',
    enter: 'power3.out'
} as const

export const DURATION = {
    text: 0.8,
    element: 0.7,
    exit: 0.4,
    enter: 0.6,
    counter: 2,
    image: 1
} as const

export const STAGGER = {
    items: 0.08,
    lines: 0.1,
    images: 0.12
} as const

export const TRIGGER_START = {
    standard: 'top 85%',
    hero: 'top 70%',
    counter: 'top 80%'
} as const

export const PRELOADER_DURATION = 2.5

/**
 * Page-transition offsets. The timing/easing deliberately reuses the shared
 * DURATION.exit / EASE.exit and DURATION.enter / EASE.enter tokens so route
 * changes stay choreographed to the same rhythm as everything else.
 */
export const PAGE_TRANSITION = {
    exitY: -30,
    enterY: 30
} as const
