/**
 * Single source of truth for the filmography.
 *
 * Artwork: the client has not delivered posters yet, so cards fall back to
 * the trailer's YouTube still via `stillFor()` in `@/lib/youtube`. Dropping a
 * real poster in later is a one-field edit per film with no layout change —
 * see the note on aspect ratio in that module.
 */

export interface Film {
    slug: string
    title: string
    /** Numeric year, used for ordering. */
    year: number
    /** Display string — Golden Brothers spans two years. */
    yearLabel: string
    genre: { sq: string; en: string }
    role: { sq: string; en: string }
    /** Primary trailer. Optional: a title may not have one archived. */
    videoId?: string
    /** Shkëmbimi shipped two trailers; this is the second. */
    altVideoId?: string
    /** Real poster path once delivered. Overrides the YouTube still. */
    poster?: string
    /** Golden Brothers links the full film, not a trailer. */
    isFullFilm?: boolean
    /** Short distinguishing line shown on the card. */
    note?: { sq: string; en: string }
}

export const films: Film[] = [
    {
        slug: 'drejt-fundit',
        title: 'Drejt Fundit',
        year: 2015,
        yearLabel: '2015',
        genre: { sq: 'Aksion', en: 'Action' },
        role: { sq: 'Regjisor · Aktor', en: 'Director · Actor' },
        videoId: '_eKTIw1T-aE',
        note: {
            sq: 'Filmi i parë shqiptar i aksionit',
            en: 'The first Albanian action film'
        }
    },
    {
        slug: 'dashuria-smjafton',
        title: "Dashuria s'mjafton",
        year: 2018,
        yearLabel: '2018',
        genre: { sq: 'Aksion · Dramë · Romancë', en: 'Action · Drama · Romance' },
        role: { sq: 'Regjisor · Aktor', en: 'Director · Actor' },
        videoId: '-MteNTjVt2A'
    },
    {
        slug: 'shkembimi',
        title: 'Shkëmbimi',
        year: 2022,
        yearLabel: '2022',
        genre: { sq: 'Aksion · Komedi · Krim', en: 'Action · Comedy · Crime' },
        role: { sq: 'Regjisor · Aktor', en: 'Director · Actor' },
        videoId: 'J_Yms2JjufU',
        altVideoId: '1rIucVpoCc8'
    },
    {
        slug: 'ego',
        title: 'Ego',
        year: 2023,
        yearLabel: '2023',
        genre: { sq: 'Aksion · Komedi · Dramë', en: 'Action · Comedy · Drama' },
        role: { sq: 'Regjisor · Aktor', en: 'Director · Actor' },
        videoId: 'zxRRn8odG9E'
    },
    {
        slug: 'golden-brothers',
        title: 'Golden Brothers',
        year: 2024,
        yearLabel: '2024 — 2025',
        genre: { sq: 'Seri', en: 'Series' },
        role: { sq: 'Regjisor · Skenarist', en: 'Director · Writer' },
        videoId: '0XOr7ayHiQI',
        isFullFilm: true
    }
]

/** Ego 2 — confirmed in production, no release window from the client yet. */
export const upcoming = {
    title: 'Ego 2',
    videoId: undefined as string | undefined,
    poster: undefined as string | undefined
}
