import type { Film } from '@/constants/films'

/**
 * Card artwork.
 *
 * The client has not delivered posters yet, so these are the trailers'
 * `maxresdefault` YouTube stills (1280x720), cached into `public/stills/` at
 * build-prep time rather than hotlinked — the site then does not depend on
 * YouTube's CDN and survives a video being made private.
 *
 * Because the stills are 16:9, the cards are 16:10 rather than poster-shaped;
 * a 2:3 portrait frame would crop them savagely. Setting `poster` on a film
 * overrides the still with no layout change.
 *
 * To refresh the cache:
 *   curl -o public/stills/<slug>.jpg \
 *     https://img.youtube.com/vi/<videoId>/maxresdefault.jpg
 */
export const stillFor = (film: Film): string | undefined => {
    if (film.poster) return film.poster
    if (!film.videoId) return undefined

    return `/stills/${film.slug}.jpg`
}

/**
 * nocookie host, so no tracking cookie is set unless the viewer actually
 * chooses to play something.
 */
export const embedUrl = (videoId: string): string =>
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`

export const watchUrl = (videoId: string): string =>
    `https://www.youtube.com/watch?v=${videoId}`
