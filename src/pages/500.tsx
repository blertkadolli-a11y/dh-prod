import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import Link from 'next/link'

import { brand } from '@/constants/site'

const ServerError: FC = (): ReactNode => {
    return (
        <>
            <Head>
                <title>500 — {brand.name}</title>
                <meta name='robots' content='noindex' />
            </Head>

            <main className='bg-grain relative flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6 text-center'>
                <span className='type-display text-[clamp(5rem,22vw,16rem)] leading-none text-foreground/10'>
                    500
                </span>

                <p className='type-meta text-foreground/55'>
                    Diçka shkoi keq — Something went wrong
                </p>

                <Link
                    href='/'
                    className='type-meta cursor-pointer bg-primary px-8 py-4 text-primary-foreground transition-colors duration-200 hover:bg-primary-bright focus-visible:ring-2 focus-visible:ring-primary-bright focus-visible:outline-none'
                >
                    Kthehu — Back home
                </Link>
            </main>
        </>
    )
}

export default ServerError
