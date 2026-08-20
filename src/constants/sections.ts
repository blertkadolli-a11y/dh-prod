import { pressItems } from '@/constants/press'

/**
 * The reel numbering shown in every section header.
 *
 * Derived from one ordered list rather than hardcoded per section, because
 * Press only renders when it has content — hardcoding would either duplicate a
 * number or leave a gap (04 → 06) depending on whether coverage exists.
 */
const order = [
    'filmography',
    'upcoming',
    'tickets',
    'media',
    ...(pressItems.length > 0 ? ['press'] : []),
    'contact'
] as const

export type SectionKey = 'filmography' | 'upcoming' | 'tickets' | 'media' | 'press' | 'contact'

export const sectionIndex = (key: SectionKey): string => {
    const position = (order as readonly string[]).indexOf(key)

    // A section not in the list (Press while empty) never renders its header,
    // so the fallback is only a safety net.
    return String(position >= 0 ? position + 1 : order.length + 1).padStart(2, '0')
}
