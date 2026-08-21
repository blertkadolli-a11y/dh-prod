import type { FC, FormEvent, ReactNode } from 'react'
import type { PartnerResponse } from '@/pages/api/partner'

import { ArrowLeft, Check, Loader2, Send } from 'lucide-react'
import { useRef, useState } from 'react'
import Link from 'next/link'

import { gsap, useGSAP } from '@/lib/gsap'
import { SelectField, TextArea, TextField } from '@/components/ui/field'
import { Counter } from '@/components/generals/counter'
import { useLanguage } from '@/context/language'
import { Action } from '@/components/ui/action'
import { FilmGrain } from '@/components/generals/film-grain'
import { Seo } from '@/components/generals/seo'

import { brand, reachStats } from '@/constants/site'
import { DURATION, EASE, STAGGER } from '@/constants/motion'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormState {
    name: string
    company: string
    email: string
    phone: string
    type: string
    budget: string
    message: string
}

const EMPTY: FormState = {
    name: '', company: '', email: '', phone: '',
    type: 'placement', budget: 'unset', message: ''
}

const PartnerPage: FC = (): ReactNode => {
    const { lang, t } = useLanguage()
    const pageRef = useRef<HTMLDivElement>(null)
    const successRef = useRef<HTMLDivElement>(null)

    const [form, setForm] = useState<FormState>(EMPTY)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const set = (key: keyof FormState) => (value: string) => {
        setForm(current => ({ ...current, [key]: value }))
        // Clear the field's error as soon as the visitor starts correcting it,
        // rather than making them resubmit to find out.
        setErrors(current => (current[key] ? { ...current, [key]: undefined } : current))
    }

    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo('.partner-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: DURATION.element, ease: EASE.element, stagger: STAGGER.items, delay: 0.1 }
        )
    }, { scope: pageRef, dependencies: [lang] })

    useGSAP(() => {
        if (status !== 'sent') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(successRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: DURATION.element, ease: EASE.element })
        gsap.fromTo('.success-tick', { scale: 0 }, { scale: 1, duration: DURATION.element, ease: 'back.out(2)' })
    }, { scope: successRef, dependencies: [status] })

    const validate = (): boolean => {
        const next: Partial<Record<keyof FormState, string>> = {}

        if (!form.name.trim()) next.name = t.partner.required
        if (!form.company.trim()) next.company = t.partner.required
        if (!EMAIL_PATTERN.test(form.email.trim())) next.email = form.email.trim() ? t.partner.invalidEmail : t.partner.required
        if (form.message.trim().length < 10) next.message = t.partner.required

        setErrors(next)

        return Object.keys(next).length === 0
    }

    const submit = async (event: FormEvent) => {
        event.preventDefault()
        if (!validate()) return

        setStatus('sending')

        try {
            const response = await fetch('/api/partner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })

            const data: PartnerResponse = await response.json()

            if (!response.ok) {
                // Map server-side field errors back onto the form.
                if (data.fields) {
                    setErrors(Object.fromEntries(
                        Object.entries(data.fields).map(([key, kind]) => [
                            key, kind === 'invalid' ? t.partner.invalidEmail : t.partner.required
                        ])
                    ))
                    setStatus('idle')

                    return
                }

                setStatus('error')

                return
            }

            setStatus('sent')
        } catch {
            setStatus('error')
        }
    }

    const typeOptions = (['placement', 'sponsorship', 'campaign', 'event', 'other'] as const)
        .map(key => ({ value: key, label: t.partner.typeOptions[key] }))

    const budgetOptions = (['unset', 'small', 'mid', 'large'] as const)
        .map(key => ({ value: key, label: t.partner.budgetOptions[key] }))

    return (
        <>
            <Seo title={t.partner.eyebrow} />
            <FilmGrain />

            <div ref={pageRef} className='bg-grain relative min-h-svh bg-background px-6 py-10 lg:px-12 lg:py-14'>
                <Link
                    href='/'
                    data-cursor-hover
                    className='partner-item type-meta inline-flex min-h-11 items-center gap-2.5 rounded-full border border-border px-5 py-3.5 text-foreground/60 transition-[color,border-color,transform] duration-300 ease-out hover:-translate-x-1 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    <ArrowLeft className='size-3.5' />
                    {t.partner.back}
                </Link>

                <div className='mt-12 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24'>
                    {/* Pitch */}
                    <div className='flex flex-col gap-8'>
                        <div className='partner-item flex items-center gap-4'>
                            <span aria-hidden='true' className='h-px w-12 bg-primary' />
                            <span className='type-meta text-foreground/55'>{t.partner.eyebrow}</span>
                        </div>

                        <h1 className='partner-item type-display text-[clamp(2.75rem,8vw,6rem)] text-foreground'>
                            {t.partner.title}
                        </h1>

                        <p className='partner-item max-w-[46ch] text-base leading-relaxed text-foreground/60'>
                            {t.partner.intro}
                        </p>

                        <dl className='partner-item grid grid-cols-2 gap-px self-start border border-border bg-border'>
                            {reachStats.map(stat => (
                                <div key={stat.label.en} className='flex flex-col gap-1.5 bg-background p-5'>
                                    <dt className='type-meta order-2 text-foreground/45'>{stat.label[lang]}</dt>
                                    <dd className='type-display order-1 text-[clamp(1.75rem,4vw,2.75rem)] text-foreground'>
                                        <Counter value={stat.value} suffix={stat.suffix} />
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <a
                            href={`mailto:${brand.email}`}
                            data-cursor-hover
                            className='partner-item type-meta flex min-h-11 w-fit items-center border-b border-border pb-1 text-foreground/45 transition-colors duration-300 hover:border-primary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                        >
                            {brand.email}
                        </a>
                    </div>

                    {/* Form */}
                    <div className='partner-item'>
                        {status === 'sent' ? (
                            <div ref={successRef} className='flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 lg:p-10'>
                                <span className='success-tick flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                    <Check className='size-7' />
                                </span>

                                <h2 className='type-display text-[clamp(1.75rem,4vw,2.5rem)] text-foreground'>
                                    {t.partner.successTitle}
                                </h2>

                                <p className='max-w-[38ch] text-base leading-relaxed text-foreground/60'>
                                    {t.partner.successBody}
                                </p>

                                <Action
                                    as='button'
                                    variant='outline'
                                    onClick={() => { setForm(EMPTY); setStatus('idle') }}
                                >
                                    {t.partner.another}
                                </Action>
                            </div>
                        ) : (
                            <form
                                onSubmit={submit}
                                noValidate
                                className='flex flex-col gap-6 rounded-3xl border border-border bg-card p-7 lg:p-10'
                            >
                                <div className='grid gap-6 sm:grid-cols-2'>
                                    <TextField id='name' label={t.partner.name} value={form.name} error={errors.name} required onChange={set('name')} />
                                    <TextField id='company' label={t.partner.company} value={form.company} error={errors.company} required onChange={set('company')} />
                                </div>

                                <div className='grid gap-6 sm:grid-cols-2'>
                                    <TextField id='email' type='email' label={t.partner.email} value={form.email} error={errors.email} required onChange={set('email')} />
                                    <TextField id='phone' type='tel' label={t.partner.phone} value={form.phone} onChange={set('phone')} />
                                </div>

                                <div className='grid gap-6 sm:grid-cols-2'>
                                    <SelectField id='type' label={t.partner.type} value={form.type} options={typeOptions} onChange={set('type')} />
                                    <SelectField id='budget' label={t.partner.budget} value={form.budget} options={budgetOptions} onChange={set('budget')} />
                                </div>

                                <TextArea
                                    id='message'
                                    label={t.partner.message}
                                    placeholder={t.partner.messagePlaceholder}
                                    value={form.message}
                                    error={errors.message}
                                    required
                                    onChange={set('message')}
                                />

                                {status === 'error' && (
                                    <p role='alert' className='type-meta text-primary-bright'>{t.partner.failed}</p>
                                )}

                                <button
                                    type='submit'
                                    disabled={status === 'sending'}
                                    data-cursor-hover
                                    className='mt-2 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-5 text-primary-foreground transition-colors duration-300 hover:bg-primary-bright disabled:cursor-wait focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none'
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <Loader2 className='size-4 animate-spin' />
                                            <span className='type-meta'>{t.partner.sending}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className='size-3.5' />
                                            <span className='type-meta'>{t.partner.submit}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PartnerPage
