import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Partnership enquiries.
 *
 * DEMO MODE (current): validates the submission and returns success. The
 * enquiry is logged server-side so nothing a visitor writes is silently lost
 * during the demo, but no email is delivered yet.
 *
 * GOING LIVE: set `RESEND_API_KEY` and uncomment the delivery block. Any
 * transactional provider works — the payload is already assembled.
 */

export interface PartnerResponse {
    ok?: boolean
    error?: string
    /** Field-level errors keyed by field name. */
    fields?: Record<string, string>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handler = async (req: NextApiRequest, res: NextApiResponse<PartnerResponse>) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')

        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { name, company, email, phone, type, budget, message } = req.body ?? {}

    // Server-side validation: the client validates too, but a client can be
    // bypassed and this is the only check that actually counts.
    const fields: Record<string, string> = {}
    if (!String(name ?? '').trim()) fields.name = 'required'
    if (!String(company ?? '').trim()) fields.company = 'required'
    if (!EMAIL_PATTERN.test(String(email ?? '').trim())) fields.email = 'invalid'
    if (String(message ?? '').trim().length < 10) fields.message = 'required'

    if (Object.keys(fields).length > 0) {
        return res.status(422).json({ error: 'Validation failed', fields })
    }

    const payload = {
        name: String(name).trim(),
        company: String(company).trim(),
        email: String(email).trim(),
        phone: String(phone ?? '').trim(),
        type: String(type ?? '').trim(),
        budget: String(budget ?? '').trim(),
        message: String(message).trim(),
        receivedAt: new Date().toISOString()
    }

    // Visible in the server console so nothing is lost while in demo mode.
    console.info('[partner enquiry]', payload)

    // --- going live ---
    // await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         from: 'web@drilonhoxha.com',
    //         to: 'd.hproduction022@gmail.com',
    //         reply_to: payload.email,
    //         subject: `Partneritet — ${payload.company}`,
    //         text: Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join('\n')
    //     })
    // })

    return res.status(200).json({ ok: true })
}

export default handler
