/**
 * DEMO DATA — no ticketing provider is connected yet.
 *
 * These screenings exist so the client can see how a live ticket release
 * behaves end to end: city, venue, date, seat tiers, availability, and a real
 * checkout flow. Replace with the actual release schedule before launch, and
 * see `src/pages/api/checkout.ts` for the one-key switch to live Stripe.
 */

export type SeatStatus = 'available' | 'few' | 'soldout'

export interface Tier {
    id: string
    label: { sq: string; en: string }
    price: number
}

export interface Screening {
    id: string
    film: string
    city: { sq: string; en: string }
    venue: string
    /** ISO date — formatted per language at render time. */
    date: string
    time: string
    currency: string
    status: SeatStatus
    /** Seat categories. The first is treated as the headline "from" price. */
    tiers: Tier[]
}

const tiers = (standard: number, vip: number): Tier[] => [
    { id: 'standard', label: { sq: 'Standard', en: 'Standard' }, price: standard },
    { id: 'vip', label: { sq: 'VIP · Rreshtat e parë', en: 'VIP · Front rows' }, price: vip }
]

export const screenings: Screening[] = [
    {
        id: 'tr-01',
        film: 'Ego 2',
        city: { sq: 'Tiranë', en: 'Tirana' },
        venue: 'Kinema Millennium',
        date: '2026-09-18',
        time: '20:00',
        currency: 'ALL',
        status: 'available',
        tiers: tiers(1200, 2000)
    },
    {
        id: 'tr-02',
        film: 'Ego 2',
        city: { sq: 'Tiranë', en: 'Tirana' },
        venue: 'Cineplexx TEG',
        date: '2026-09-19',
        time: '21:30',
        currency: 'ALL',
        status: 'few',
        tiers: tiers(1200, 2000)
    },
    {
        id: 'pr-01',
        film: 'Ego 2',
        city: { sq: 'Prishtinë', en: 'Pristina' },
        venue: 'Cineplexx Prishtina',
        date: '2026-09-25',
        time: '20:00',
        currency: 'EUR',
        status: 'available',
        tiers: tiers(5, 9)
    },
    {
        id: 'sk-01',
        film: 'Ego 2',
        city: { sq: 'Shkup', en: 'Skopje' },
        venue: 'Cineplexx Skopje',
        date: '2026-10-02',
        time: '19:30',
        currency: 'EUR',
        status: 'available',
        tiers: tiers(5, 9)
    },
    {
        id: 'dr-01',
        film: 'Ego 2',
        city: { sq: 'Durrës', en: 'Durrës' },
        venue: 'Kinema Aleksandër Moisiu',
        date: '2026-10-09',
        time: '20:30',
        currency: 'ALL',
        status: 'soldout',
        tiers: tiers(1000, 1800)
    }
]

/** Headline "from" price for a row. */
export const fromPrice = (screening: Screening): number =>
    Math.min(...screening.tiers.map(tier => tier.price))

/**
 * Month abbreviations are hardcoded rather than taken from
 * `toLocaleDateString`. Intl resolves differently in Node than in the browser
 * — the server rendered "18 sht" while the client rendered "18 Sept", which
 * tripped a React hydration mismatch. A fixed table is deterministic on both.
 */
const MONTHS: Record<'sq' | 'en', string[]> = {
    sq: ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'korr', 'gush', 'sht', 'tet', 'nën', 'dhj'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
}

export const formatScreeningDate = (iso: string, lang: 'sq' | 'en'): string => {
    const [, month, day] = iso.split('-')

    return `${day} ${MONTHS[lang][Number(month) - 1]}`
}

/** Full date for the checkout summary, e.g. "18 sht 2026". */
export const formatScreeningDateLong = (iso: string, lang: 'sq' | 'en'): string => {
    const [year] = iso.split('-')

    return `${formatScreeningDate(iso, lang)} ${year}`
}
