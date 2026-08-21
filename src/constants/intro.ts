import { films } from '@/constants/films'

/**
 * Shared timing for the opening.
 *
 * The preloader and the hero both animate on the same clock, so these numbers
 * live in one place. They used to be duplicated — a hardcoded `HERO_START` in
 * the hero and a computed leader length in the preloader — and removing a film
 * silently pulled the preloader 0.16s earlier while the hero stayed put. The
 * letterbox bars then opened onto a blank frame before the hero began.
 */

/** Seconds each leader title holds on screen. */
export const TITLE_HOLD = 0.16

/** When the title sequence finishes and the name resolves. */
export const LEADER_END = films.length * TITLE_HOLD + 0.1

/** When the letterbox bars begin splitting apart. */
export const BARS_SPLIT_AT = LEADER_END + 1.05

/**
 * When the hero starts revealing — deliberately *before* the bars part, so
 * they open onto motion already in progress rather than an empty stage. The
 * two reads as one continuous move instead of two sequential animations.
 */
export const HERO_START = BARS_SPLIT_AT - 0.35
