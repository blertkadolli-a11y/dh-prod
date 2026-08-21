import type { FC, ReactNode } from 'react'
import type { Film } from '@/constants/films'

import { Play } from 'lucide-react'

import { useLanguage } from '@/context/language'
import { stillFor } from '@/lib/youtube'
import { Action } from '@/components/ui/action'
import { cn } from '@/lib/utils'

interface FilmCardProps {
    film: Film
    /** Reel position, 0-based. Rendered as 01…05. */
    index: number
    onPlay: (videoId: string, title: string) => void
}

/**
 * Two layouts, one markup.
 *
 * From lg the still is a full-bleed backdrop with the text laid over it — the
 * card is a fixed 16:10 so the pinned track has uniform widths.
 *
 * Below lg the still becomes a 16:9 block at the top of the card with the text
 * beneath, and the card's height is content-driven. This matters: the stills
 * are 16:9, so forcing them behind a portrait card cropped away most of the
 * frame and the shot read as zoomed in. Giving the image its own band at its
 * native ratio shows the whole frame.
 */
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
                'film-card group relative flex w-[min(86vw,42rem)] shrink-0 snap-center flex-col overflow-hidden bg-card lg:snap-align-none',
                'lg:aspect-[16/10] lg:justify-between',
                'rounded-2xl border border-border transition-[border-color,transform] duration-500 ease-out',
                'hover:-translate-y-1.5 hover:border-primary/60'
            )}
        >
            {/* Media. In flow at 16:9 on touch; a full-bleed backdrop from lg. */}
            <div
                className={cn(
                    'card-parallax relative aspect-video w-full shrink-0 overflow-hidden',
                    'lg:absolute lg:inset-0 lg:aspect-auto lg:h-full'
                )}
            >
                {still ? (
                    <img
                        src={still}
                        alt={`${film.title} (${film.yearLabel})`}
                        loading='lazy'
                        decoding='async'
                        // The 1.16 overscan exists only so the desktop parallax can
                        // shift the image without exposing an edge. On touch there is
                        // no parallax, so the image sits at its true size and the
                        // whole frame is visible.
                        className='still-graded h-full w-full object-cover will-change-transform lg:scale-[1.16] lg:group-hover:scale-[1.22] motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out'
                    />
                ) : (
                    // Fallback for any future title with no trailer archived: a
                    // typographic plate rather than a grey placeholder.
                    <div className='flex h-full w-full items-center justify-center bg-[#101214]'>
                        <span
                            aria-hidden='true'
                            className='type-display text-[22vw] leading-none text-foreground/[0.05] lg:text-[14rem]'
                        >
                            {film.yearLabel}
                        </span>
                    </div>
                )}

                {/* Legibility scrim for the overlaid text — only when text sits
                    on top of the image, i.e. from lg. */}
                <div
                    aria-hidden='true'
                    className='absolute inset-0 hidden bg-gradient-to-t from-black via-black/55 to-black/10 lg:block'
                />

                {/* Crimson wash that lifts as the card wakes up. */}
                <div
                    aria-hidden='true'
                    className='absolute inset-0 bg-primary/[0.1] transition-opacity duration-700 ease-out group-hover:opacity-0'
                />
            </div>

            {/* Reel number + year. */}
            <div className='relative flex items-start justify-between gap-4 px-5 pt-4 lg:p-8'>
                <span className='type-meta text-primary-bright'>{reel}</span>
                <span className='type-meta text-foreground/60'>{film.yearLabel}</span>
            </div>

            <div className='relative flex flex-col gap-3 p-5 pt-3 lg:p-8'>
                {film.note && (
                    <span className='type-meta w-fit max-w-full border-l-2 border-primary pl-3 text-foreground/70'>
                        {film.note[lang]}
                    </span>
                )}

                <h3 className='type-display text-[clamp(1.75rem,6vw,4.5rem)] text-foreground transition-transform duration-500 ease-out group-hover:-translate-y-0.5'>
                    {film.title}
                </h3>

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                    <span className='type-meta text-primary-bright'>{film.genre[lang]}</span>
                    <span aria-hidden='true' className='h-3 w-px bg-border' />
                    <span className='type-meta text-foreground/55'>{film.role[lang]}</span>
                </div>

                <div className='mt-2 flex flex-wrap items-center gap-3'>
                    {film.videoId ? (
                        <Action
                            as='button'
                            // Magnetic pull is disabled inside the track: the card is
                            // already being translated, and a second transform on
                            // hover reads as a glitch.
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
