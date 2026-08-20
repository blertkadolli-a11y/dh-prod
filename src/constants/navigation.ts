export type NavLink = {
    key: 'filmography' | 'upcoming' | 'tickets' | 'media' | 'contact'
    href: string
}

// Press is intentionally absent from the nav: the section renders nothing
// while `pressItems` is empty, and a nav link to a missing anchor is a broken
// link. Add { key: 'press', href: '#shtypi' } once coverage exists.

export const navLinks: NavLink[] = [
    { key: 'filmography', href: '#filmografia' },
    { key: 'upcoming', href: '#se-shpejti' },
    { key: 'tickets', href: '#bileta' },
    { key: 'media', href: '#media' },
    { key: 'contact', href: '#kontakt' }
]
