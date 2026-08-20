import type { FC, ReactNode } from 'react'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = (): Lenis | null => useContext(LenisContext)

interface SmoothScrollProviderProps {
    children: ReactNode
}

export const SmoothScrollProvider: FC<SmoothScrollProviderProps> = ({ children }): ReactNode => {
    const [lenis, setLenis] = useState<Lenis | null>(null)

    useEffect(() => {
        const instance = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        })

        instance.on('scroll', ScrollTrigger.update)

        const update = (time: number) => {
            instance.raf(time * 1000)
        }

        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)

        setLenis(instance)

        return () => {
            gsap.ticker.remove(update)
            instance.destroy()
            setLenis(null)
        }
    }, [])

    return (
        <LenisContext.Provider value={lenis}>
            {children}
        </LenisContext.Provider>
    )
}
