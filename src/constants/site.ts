import type { SiteConfig } from '@/types'

import { films } from '@/constants/films'

/**
 * Canonical origin. Used to build the absolute `og:image` and `og:url`.
 *
 * Deliberately the live Vercel alias, NOT drilonhoxha.com: that domain is
 * currently parked and answers 302 for everything, so an og:image pointing at
 * it fails to load and link previews in WhatsApp / Instagram / Telegram come
 * through with no thumbnail. Switch this the day the domain actually points at
 * this project.
 */
export const SITE_ORIGIN = 'https://dh-prod-delta.vercel.app'

export const siteConfig: SiteConfig = {
    name: 'Drilon Hoxha',
    description:
        'Aktor, regjisor, producent dhe skenarist shqiptar. Themelues i D.H Production. Filmografia, projektet e ardhshme dhe bashkëpunimet.',
    url: SITE_ORIGIN,
    ogImage: '/og.jpg'
}

/**
 * While true the site emits `noindex, nofollow`.
 *
 * This matters more than usual here: the screening dates in
 * `src/constants/screenings.ts` are invented. If a search engine indexed this
 * preview, fabricated Ego 2 premiere dates would be attributed to a real
 * filmmaker and a real film. Set to false only when the real schedule is in.
 */
export const IS_DEMO = true

export const brand = {
    name: 'Drilon Hoxha',
    company: 'D.H Production',
    companyFounded: 2015,
    email: 'd.hproduction022@gmail.com',
    social: {
        instagram: 'https://www.instagram.com/drilonhoxha/',
        youtube: 'https://www.youtube.com/@DrilonHoxhaOfficial'
    }
}

/**
 * Reach figures for the sponsor kit. `value` drives the count-up animation;
 * `suffix` is appended after the counter settles.
 */
/**
 * Years on screen counts from the first title shown in the filmography.
 * Written as a literal rather than `new Date().getFullYear()`: that resolves
 * differently on server and client across a year boundary and would risk the
 * same class of hydration mismatch the screening dates already hit.
 */
const YEARS_ON_SCREEN = 11

export const reachStats = [
    { value: 340, suffix: 'K', label: { sq: 'Ndjekës personalë', en: 'Personal following' } },
    { value: 19, suffix: 'K', label: { sq: 'D.H Production', en: 'D.H Production' } },
    // Derived, so removing or adding a film can never leave this stale.
    { value: films.length, suffix: '', label: { sq: 'Tituj', en: 'Titles' } },
    { value: YEARS_ON_SCREEN, suffix: '', label: { sq: 'Vite në ekran', en: 'Years on screen' } }
]

/**
 * PLACEHOLDER — these are illustrative figures so the media kit reads as a real
 * one. They must be replaced with the actual numbers from Instagram Insights
 * before this page is shown to any sponsor.
 */
export const audience = {
    geography: [
        { label: { sq: 'Shqipëri', en: 'Albania' }, value: 44 },
        { label: { sq: 'Kosovë', en: 'Kosovo' }, value: 33 },
        { label: { sq: 'Maqedoni e Veriut', en: 'North Macedonia' }, value: 9 },
        { label: { sq: 'Diasporë', en: 'Diaspora' }, value: 14 }
    ],
    age: [
        { label: '18–24', value: 31 },
        { label: '25–34', value: 38 },
        { label: '35–44', value: 19 },
        { label: '45+', value: 12 }
    ],
    split: { male: 58, female: 42 }
}

/**
 * Past brand partners. Empty until the client supplies them — the collaborator
 * strip renders nothing at all rather than an empty shell.
 */
export const collaborators: string[] = []
