import type { FC, ReactNode } from 'react'

import { SectionRail } from '@/components/generals/section-rail'
import { FilmGrain } from '@/components/generals/film-grain'
import { Marquee } from '@/components/generals/marquee'
import { Preloader } from '@/components/generals/preloader'
import { Seo } from '@/components/generals/seo'

import { Filmography } from '@/components/sections/filmography'
import { Upcoming } from '@/components/sections/upcoming'
import { MediaKit } from '@/components/sections/media-kit'
import { Navbar } from '@/components/sections/navbar'
import { Contact } from '@/components/sections/contact'
import { Press } from '@/components/sections/press'
import { Tickets } from '@/components/sections/tickets'
import { Footer } from '@/components/sections/footer'
import { Hero } from '@/components/sections/hero'

import { films } from '@/constants/films'

const Home: FC = (): ReactNode => {
    return (
        <>
            <Seo />
            <Preloader />

            <FilmGrain />
            <Navbar />
            <SectionRail />

            <main>
                <Hero />
                <Filmography />

                <Marquee items={films.map(film => film.title)} />

                <Upcoming />
                <Tickets />
                <MediaKit />
                <Press />
                <Contact />
            </main>

            <Footer />
        </>
    )
}

export default Home
