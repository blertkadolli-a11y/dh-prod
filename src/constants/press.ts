/**
 * Press, interviews, festival selections and awards.
 *
 * Deliberately empty. Every entry here is a claim about a real publication or
 * institution, so nothing goes in until the client supplies the actual link —
 * inventing plausible-looking coverage would be fabricating a record, not
 * mocking up a layout (unlike `screenings.ts`, which mocks a mechanism).
 *
 * The section renders nothing at all while this array is empty, and appears
 * fully formed the moment items are added. To add one:
 *
 *   { id: 'panorama-2023', outlet: 'Panorama', title: '…', href: 'https://…',
 *     year: 2023, kind: 'interview' }
 */

export type PressKind = 'interview' | 'feature' | 'award' | 'festival'

export interface PressItem {
    id: string
    outlet: string
    title: string
    href: string
    year: number
    kind: PressKind
}

export const pressItems: PressItem[] = []
