import Head from 'next/head'

import type { FC, ReactNode } from 'react'
import type { SeoProps } from '@/types'

import { IS_DEMO, siteConfig } from '@/constants/site'

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

            {/* Keeps the demo — and its placeholder screening dates — out of
                search results until the real schedule replaces them. */}
            {IS_DEMO && <meta name='robots' content='noindex, nofollow' />}
            <meta property='og:title' content={pageTitle} />
            <meta property='og:description' content={description} />
            <meta property='og:type' content='website' />
            <meta property='og:site_name' content={siteConfig.name} />
            <meta property='og:locale' content='sq_AL' />
            <meta property='og:url' content={siteConfig.url} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={pageTitle} />
            <meta name='twitter:description' content={description} />

            {absoluteOgImage && (
                <>
                    <meta property='og:image' content={absoluteOgImage} />
                    {/* Explicit dimensions let chat apps reserve the card before
                        the image loads, so the preview does not jump or fall
                        back to a text-only link. */}
                    <meta property='og:image:width' content='1200' />
                    <meta property='og:image:height' content='630' />
                    <meta property='og:image:alt' content={siteConfig.name} />
                    <meta name='twitter:image' content={absoluteOgImage} />
                </>
            )}
        </Head>
    )
}