import type { FC, ReactNode } from 'react'
import type { Film } from '@/constants/films'

import { Play } from 'lucide-react'

import { useLanguage } from '@/context/language'
import { stillFor } from '@/lib/youtube'
import { Action } from '@/components/ui/action'
import { cn } from '@/lib/utils'

interface FilmCardProps {
    film: Film
    /** Reel position, 0-based. Rendered as 01…06. */
    index: number
    onPlay: (videoId: string, title: string) => void
}

export const FilmCard: FC<FilmCardProps> = ({ film, index, onPlay }): ReactNode => {
    const { lang, t } = useLanguage()
    const still = stillFor(film)
    const reel = String(index + 1).padStart(2, '0')

    const label = film.isFullFilm ? t.filmography.watchFull : t.filmography.watchTrailer

    return (
        <article
            data-cursor-hover={film.videoId ? '' : undefined}
            data-cursor-label={film.videoId ? t.ui.watch : undefined}
            className={cn(
                'film-card group relative flex w-[min(86vw,42rem)] shrink-0 snap-center flex-col justify-between overflow-hidden bg-card lg:snap-align-none',
                // Mobile cards are content-driven: at 88vw the 16:10 ratio is only
                // ~206px tall, which clipped the CTA clean off. The fixed ratio is
                // kept from lg up, where the pinned track needs uniform card sizes.
                'aspect-[4/5] min-h-[22rem] sm:aspect-[16/10] lg:min-h-0',
                'rounded-2xl border border-border transition-[border-color,transform] duration-500 ease-out',
                'hover:-translate-y-1.5 hover:border-primary/60'
            )}
        >
            {still ? (
                // Overscanned wrapper: the parallax shifts it horizontally, so it
                // has to be wider than the card or the edges would show through.
                <div className='card-parallax absolute inset-0 overflow-hidden'>
                    <img
                        src={still}
                        alt={`${film.title} (${film.yearLabel})`}
                        loading='lazy'
                        decoding='async'
                        className='still-graded absolute inset-0 h-full w-full scale-[1.16] object-cover will-change-transform group-hover:scale-[1.22] motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out'
                    />
                </div>
            ) : (
                // Çimi has no linked video and therefore no still. A typographic
                // card is a deliberate choice over a grey placeholder: it makes the
                // debut read as intentional rather than as missing artwork.
                <div className='absolute inset-0 flex items-center justify-center bg-[#101214]'>
                    <span
                        aria-hidden='true'
                        className='type-display text-[28vw] leading-none text-foreground/[0.05] transition-transform duration-[900ms] ease-out group-hover:scale-105 lg:text-[14rem]'
                    >
                        {film.yearLabel}
                    </span>
                </div>
            )}

            <div
                aria-hidden='true'
                className='absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10'
            />

            {/* Crimson wash that lifts as the card wakes up. */}
            <div
                aria-hidden='true'
                className='absolute inset-0 bg-primary/[0.1] opacity-100 transition-opacity duration-700 ease-out group-hover:opacity-0'
            />

            {/* Reel number + year — the production-sheet register. Kept in flow
                rather than absolutely positioned: on cards whose content grows
                past the aspect ratio, an absolute row overlaps the text block. */}
            <div className='relative flex items-start justify-between gap-4 p-6 lg:p-8'>
                <span className='type-meta text-primary-bright'>
                    {reel}
                </span>

                <span className='type-meta text-foreground/60'>
                    {film.yearLabel}
                </span>
            </div>

            <div className='relative flex flex-col gap-3 p-6 lg:p-8'>
                {/* Kicker sits in normal flow above the title. */}
                {film.note && (
                    <span className='type-meta w-fit max-w-full border-l-2 border-primary pl-3 text-foreground/70'>
                        {film.note[lang]}
                    </span>
                )}

                <h3 className='type-display text-[clamp(2.25rem,7vw,4.5rem)] text-foreground transition-transform duration-500 ease-out group-hover:-translate-y-0.5'>
                    {film.title}
                </h3>

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                    <span className='type-meta text-primary-bright'>
                        {film.genre[lang]}
                    </span>
                    <span aria-hidden='true' className='h-3 w-px bg-border' />
                    <span className='type-meta text-foreground/55'>
                        {film.role[lang]}
                    </span>
                </div>

                <div className='mt-2 flex flex-wrap items-center gap-3'>
                    {film.videoId ? (
                        <Action
                            as='button'
                            // Magnetic pull is disabled inside the pinned track: the
                            // card is already being translated horizontally, and a
                            // second transform on hover reads as a glitch.
                            still
                            variant='primary'
                            icon={<Play className='size-3.5 fill-current' />}
                            onClick={() => onPlay(film.videoId as string, film.title)}
                        >
                            {label}
                        </Action>
                    ) : (
                        <span className='type-meta rounded-full border border-border px-7 py-4 text-foreground/40'>
                            {t.filmography.noTrailer}
                        </span>
                    )}

                    {film.altVideoId && (
                        <Action
                            as='button'
                            still
                            variant='outline'
                            onClick={() => onPlay(film.altVideoId as string, `${film.title} — ${t.filmography.secondTrailer}`)}
                        >
                            {t.filmography.secondTrailer}
                        </Action>
                    )}
                </div>
            </div>
        </article>
    )
}
