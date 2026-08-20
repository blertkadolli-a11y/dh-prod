import '@/styles/globals.css'
import 'lenis/dist/lenis.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import { Archivo, JetBrains_Mono } from 'next/font/google'

import { SmoothScrollProvider } from '@/components/generals/smooth-scroll-provider'
import { LanguageProvider } from '@/context/language'
import { Cursor } from '@/components/generals/cursor'

/**
 * Archivo is variable on BOTH weight (100-900) and width (62-125), served as a
 * single file. That one family covers the poster-condensed display type and the
 * normal-width body copy, so the display voice and the reading voice are the
 * same typeface at different extremes — cheaper to load and more coherent than
 * bolting a separate display face on top.
 *
 * latin-ext is mandatory: Albanian needs ë and ç.
 */
const archivo = Archivo({
    variable: '--font-sans',
    subsets: ['latin', 'latin-ext'],
    axes: ['wdth']
})

/** Metadata voice — years, roles, reel numbers. Reads as a production sheet. */
const jetbrainsMono = JetBrains_Mono({
    variable: '--font-mono',
    subsets: ['latin', 'latin-ext']
})

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className={`${archivo.variable} ${jetbrainsMono.variable} h-full font-sans antialiased`}>
            <LanguageProvider>
                <SmoothScrollProvider>
                    <Cursor />

                    <Component {...pageProps} />
                </SmoothScrollProvider>
            </LanguageProvider>
        </div>
    )
}

export default App
