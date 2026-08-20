import { Head, Html, Main, NextScript } from 'next/document'

import type { ReactNode } from 'react'

import { extensionNoiseScript } from '@/lib/extension-noise'

const Document = (): ReactNode => {
    const noiseGuard = extensionNoiseScript()

    return (
        // Albanian is the default; the language toggle updates this at runtime.
        <Html lang='sq'>
            <Head>
                <link rel='icon' type='image/png' href='/favicon.png' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <meta name='theme-color' content='#16181A' />

                {/* Must run before the client bundle so it registers its error
                    listeners ahead of Next's dev overlay. Dev only. */}
                {noiseGuard && <script dangerouslySetInnerHTML={{ __html: noiseGuard }} />}
            </Head>

            <body className='bg-background'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
