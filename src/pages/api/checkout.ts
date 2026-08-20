import type { NextApiRequest, NextApiResponse } from 'next'

import { screenings } from '@/constants/screenings'

/**
 * Ticket checkout.
 *
 * DEMO MODE (current): no `STRIPE_SECRET_KEY` is set, so this validates the
 * order, prices it on the server, and returns a reservation reference. The UI
 * shows a confirmation. No money moves and no card data is touched anywhere.
 *
 * GOING LIVE: set `STRIPE_SECRET_KEY`, add the `stripe` package, and replace
 * the marked block below with a Checkout Session. The client already handles a
 * `url` in the response by redirecting to it, which is exactly how Stripe
 * Checkout works — the customer enters card details on Stripe's own hosted
 * page, never on this site. Nothing else in the UI has to change.
 *
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
 *   const session = await stripe.checkout.sessions.create({
 *       mode: 'payment',
 *       line_items: [{
 *           quantity,
 *           price_data: {
 *               currency: screening.currency.toLowerCase(),
 *               unit_amount: tier.price * 100,
 *               product_data: { name: `${screening.film} — ${screening.venue}` }
 *           }
 *       }],
 *       success_url: `${origin}/bileta/sukses?session_id={CHECKOUT_SESSION_ID}`,
 *       cancel_url: `${origin}/#bileta`
 *   })
 *   return res.status(200).json({ url: session.url })
 */

/** Booking fee per ticket, charged in the screening's own currency. */
const SERVICE_FEE = { ALL: 100, EUR: 1 } as const

export interface CheckoutResponse {
    reference?: string
    total?: number
    currency?: string
    /** Present once Stripe is live — the client redirects here. */
    url?: string
    error?: string
}

const reference = (): string => {
    const block = () => Math.random().toString(36).slice(2, 6).toUpperCase()

    return `DH-${block()}-${block()}`
}

const handler = (req: NextApiRequest, res: NextApiResponse<CheckoutResponse>) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')

        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { screeningId, tierId, quantity } = req.body ?? {}

    const screening = screenings.find(item => item.id === screeningId)
    if (!screening) return res.status(400).json({ error: 'Unknown screening' })
    if (screening.status === 'soldout') return res.status(409).json({ error: 'Sold out' })

    const tier = screening.tiers.find(item => item.id === tierId)
    if (!tier) return res.status(400).json({ error: 'Unknown seat category' })

    const count = Number(quantity)
    if (!Number.isInteger(count) || count < 1 || count > 10) {
        return res.status(400).json({ error: 'Quantity must be between 1 and 10' })
    }

    // Priced on the server, never from whatever the client posted.
    const fee = SERVICE_FEE[screening.currency as keyof typeof SERVICE_FEE] ?? 0
    const total = (tier.price + fee) * count

    // --- replace this block with the Stripe session above ---
    return res.status(200).json({
        reference: reference(),
        total,
        currency: screening.currency
    })
}

export default handler
