import type { FC, ReactNode } from 'react'
import type { Copy, Language } from '@/constants/copy'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { copy } from '@/constants/copy'

const STORAGE_KEY = 'dh-lang'

interface LanguageValue {
    lang: Language
    t: Copy
    toggle: () => void
}

const LanguageContext = createContext<LanguageValue | null>(null)

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }): ReactNode => {
    // Always start on 'sq' so server and first client render agree; the stored
    // preference is applied in an effect to avoid a hydration mismatch.
    const [lang, setLang] = useState<Language>('sq')

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored === 'en' || stored === 'sq') setLang(stored)
    }, [])

    useEffect(() => {
        document.documentElement.lang = lang
    }, [lang])

    const toggle = useCallback(() => {
        setLang(current => {
            const next: Language = current === 'sq' ? 'en' : 'sq'
            window.localStorage.setItem(STORAGE_KEY, next)

            return next
        })
    }, [])

    return (
        <LanguageContext.Provider value={{ lang, t: copy[lang], toggle }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = (): LanguageValue => {
    const value = useContext(LanguageContext)
    if (!value) throw new Error('useLanguage must be used within LanguageProvider')

    return value
}
