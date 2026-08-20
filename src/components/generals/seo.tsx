import Head from 'next/head'

import type { FC, ReactNode } from 'react'
import type { SeoProps } from '@/types'

import { siteConfig } from '@/constants/site'

export const Seo: FC<SeoProps> = ({
    title,
    description = siteConfig.description,
    ogImage = siteConfig.ogImage
}): ReactNode => {
    const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

    // Crawlers cannot resolve a relative og:image, so make it absolute.
    const absoluteOgImage = ogImage?.startsWith('http')
        ? ogImage
        : ogImage && `${siteConfig.url}${ogImage}`

    return (
        <Head>
            <title>
                {pageTitle}
            </title>

            <meta name='description' content={description} />
            <meta property='og:title' content={pageTitle} />
            <meta property='og:description' content={description} />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={siteConfig.url} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={pageTitle} />
            <meta name='twitter:description' content={description} />

            {absoluteOgImage && <meta property='og:image' content={absoluteOgImage} />}
        </Head>
    )
}