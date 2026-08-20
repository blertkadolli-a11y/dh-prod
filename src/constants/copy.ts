/**
 * Albanian is the primary language — the audience is overwhelmingly
 * Albanian-speaking. English exists for festival programmers, press and
 * prospective sponsors reading the media kit.
 *
 * Film titles are never translated; they are proper nouns. Genre and role
 * strings live on each film in `@/constants/films`.
 */

export type Language = 'sq' | 'en'

const sq = {
    nav: {
        filmography: 'Filmografia',
        upcoming: 'Së shpejti',
        tickets: 'Bileta',
        media: 'Media',
        contact: 'Kontakt'
    },
    hero: {
        roles: 'Aktor · Regjisor · Producent · Skenarist',
        intro: 'Filmi i parë shqiptar i aksionit — dhe gjithçka që erdhi pas tij.',
        scroll: 'Lëviz'
    },
    filmography: {
        eyebrow: 'Filmografia',
        titleLines: ['Pesë tituj.', 'Një dekadë.'],
        hint: 'Lëviz për të parë',
        watchTrailer: 'Shiko trailerin',
        watchFull: 'Shiko filmin e plotë',
        secondTrailer: 'Trailer 2',
        noTrailer: 'Trailer i padisponueshëm'
    },
    upcoming: {
        eyebrow: 'Së shpejti',
        tag: 'Në prodhim',
        body: 'Vazhdimi i Ego. Premiera në shtator 2026 — biletat tashmë në shitje.',
        cta: 'Shiko datat'
    },
    tickets: {
        eyebrow: 'Bileta',
        title: 'Shfaqjet e ardhshme',
        body: 'Ego 2 vjen në kinema. Zgjidh qytetin dhe siguro vendin tënd.',
        buy: 'Bli bileta',
        soldOut: 'Shitur',
        few: 'Vende të pakta',
        available: 'Në shitje',
        from: 'Nga',
        allDates: 'shfaqje',
        mailSubject: 'Rezervim biletash'
    },
    media: {
        eyebrow: 'Media & Partneritete',
        titleLines: ['Një audiencë', 'që shikon.'],
        body: 'D.H Production ka ndërtuar një audiencë besnike në të gjithë hapësirën shqipfolëse — Shqipëri, Kosovë, Maqedoni e Veriut dhe diasporë. Për sponsorizime, bashkëpunime dhe vendosje produkti brenda filmit, na shkruani.',
        cta: 'Bëhu partner',
        collabTitle: 'Kanë bashkëpunuar',
        geography: 'Ku ndodhet audienca',
        age: 'Mosha',
        split: 'Gjinia',
        male: 'Meshkuj',
        female: 'Femra',
        placement: 'Vendosje produkti · Sponsorizim · Bashkëpunim',
        mailSubject: 'Kërkesë për partneritet'
    },
    checkout: {
        title: 'Blerje biletash',
        tier: 'Kategoria e vendit',
        quantity: 'Numri i biletave',
        each: 'për biletë',
        subtotal: 'Nëntotali',
        fee: 'Tarifa e shërbimit',
        total: 'Totali',
        pay: 'Paguaj në mënyrë të sigurt',
        processing: 'Duke përpunuar…',
        secure: 'Pagesa përpunohet nga Stripe',
        successTitle: 'Bileta u rezervua',
        successBody: 'Të dhënat e biletës do t\'ju vijnë me email menjëherë pas pagesës.',
        reference: 'Numri i porosisë',
        done: 'Mbyll',
        max: 'Maksimumi 10 bileta për porosi'
    },
    partner: {
        eyebrow: 'Partneritet',
        title: 'Le të punojmë bashkë.',
        intro: 'D.H Production bashkëpunon me marka që duan të arrijnë audiencën shqipfolëse — brenda filmit, në fushata dhe në rrjete sociale. Na trego çfarë ke në mendje.',
        name: 'Emri dhe mbiemri',
        company: 'Kompania',
        email: 'Email',
        phone: 'Telefon (opsionale)',
        type: 'Lloji i bashkëpunimit',
        typeOptions: {
            placement: 'Vendosje produkti në film',
            sponsorship: 'Sponsorizim',
            campaign: 'Fushatë në rrjete sociale',
            event: 'Event / Premierë',
            other: 'Tjetër'
        },
        budget: 'Buxheti i parashikuar',
        budgetOptions: {
            unset: 'Ende pa përcaktuar',
            small: 'Deri në 5.000 €',
            mid: '5.000 € — 20.000 €',
            large: 'Mbi 20.000 €'
        },
        message: 'Përshkruaj projektin',
        messagePlaceholder: 'Cila është marka, çfarë doni të arrini dhe në çfarë afati?',
        submit: 'Dërgo kërkesën',
        sending: 'Duke dërguar…',
        successTitle: 'Kërkesa u dërgua',
        successBody: 'Faleminderit. Do t\'ju përgjigjemi brenda pak ditësh.',
        another: 'Dërgo një tjetër',
        back: 'Kthehu në faqe',
        required: 'Kjo fushë është e detyrueshme',
        invalidEmail: 'Adresa e email-it nuk duket e saktë',
        failed: 'Diçka shkoi keq. Provo përsëri ose na shkruaj direkt.'
    },
    press: {
        eyebrow: 'Në media',
        title: 'Shtypi & çmimet'
    },
    contact: {
        eyebrow: 'Kontakt',
        title: 'Le të flasim.',
        body: 'Për role, bashkëpunime, shtyp ose partneritete.',
        follow: 'Ndiqni'
    },
    footer: {
        rights: 'Të gjitha të drejtat e rezervuara.'
    },
    ui: {
        close: 'Mbyll',
        langLabel: 'Ndrysho gjuhën',
        watch: 'Shiko',
        buy: 'Bli',
        open: 'Hap'
    }
}

const en: typeof sq = {
    nav: {
        filmography: 'Filmography',
        upcoming: 'Coming Soon',
        tickets: 'Tickets',
        media: 'Media',
        contact: 'Contact'
    },
    hero: {
        roles: 'Actor · Director · Producer · Screenwriter',
        intro: 'The first Albanian action film — and everything that came after.',
        scroll: 'Scroll'
    },
    filmography: {
        eyebrow: 'Filmography',
        titleLines: ['Five titles.', 'One decade.'],
        hint: 'Scroll to explore',
        watchTrailer: 'Watch trailer',
        watchFull: 'Watch full film',
        secondTrailer: 'Trailer 2',
        noTrailer: 'Trailer unavailable'
    },
    upcoming: {
        eyebrow: 'Coming soon',
        tag: 'In production',
        body: 'The sequel to Ego. Premiering September 2026 — tickets now on sale.',
        cta: 'See dates'
    },
    tickets: {
        eyebrow: 'Tickets',
        title: 'Upcoming screenings',
        body: 'Ego 2 is coming to cinemas. Pick your city and secure your seat.',
        buy: 'Buy tickets',
        soldOut: 'Sold out',
        few: 'Few seats left',
        available: 'On sale',
        from: 'From',
        allDates: 'screenings',
        mailSubject: 'Ticket booking'
    },
    media: {
        eyebrow: 'Media & Partnerships',
        titleLines: ['An audience', 'that shows up.'],
        body: 'D.H Production has built a loyal audience across the Albanian-speaking world — Albania, Kosovo, North Macedonia and the diaspora. For sponsorship, collaborations and in-film product placement, get in touch.',
        cta: 'Become a partner',
        collabTitle: 'Past partners',
        geography: 'Where the audience is',
        age: 'Age',
        split: 'Gender',
        male: 'Male',
        female: 'Female',
        placement: 'Product placement · Sponsorship · Collaboration',
        mailSubject: 'Partnership enquiry'
    },
    checkout: {
        title: 'Ticket purchase',
        tier: 'Seat category',
        quantity: 'Number of tickets',
        each: 'per ticket',
        subtotal: 'Subtotal',
        fee: 'Service fee',
        total: 'Total',
        pay: 'Pay securely',
        processing: 'Processing…',
        secure: 'Payment handled by Stripe',
        successTitle: 'Tickets reserved',
        successBody: 'Your ticket details arrive by email immediately after payment.',
        reference: 'Order reference',
        done: 'Close',
        max: 'Maximum 10 tickets per order'
    },
    partner: {
        eyebrow: 'Partnership',
        title: "Let's work together.",
        intro: 'D.H Production works with brands that want to reach the Albanian-speaking audience — in-film, in campaigns and across social. Tell us what you have in mind.',
        name: 'Full name',
        company: 'Company',
        email: 'Email',
        phone: 'Phone (optional)',
        type: 'Type of collaboration',
        typeOptions: {
            placement: 'In-film product placement',
            sponsorship: 'Sponsorship',
            campaign: 'Social media campaign',
            event: 'Event / Premiere',
            other: 'Other'
        },
        budget: 'Indicative budget',
        budgetOptions: {
            unset: 'Not decided yet',
            small: 'Up to €5,000',
            mid: '€5,000 — €20,000',
            large: 'Over €20,000'
        },
        message: 'Describe the project',
        messagePlaceholder: 'What is the brand, what do you want to achieve, and on what timeline?',
        submit: 'Send enquiry',
        sending: 'Sending…',
        successTitle: 'Enquiry sent',
        successBody: 'Thank you. We will get back to you within a few days.',
        another: 'Send another',
        back: 'Back to site',
        required: 'This field is required',
        invalidEmail: 'That email address does not look right',
        failed: 'Something went wrong. Try again or write to us directly.'
    },
    press: {
        eyebrow: 'In the press',
        title: 'Press & awards'
    },
    contact: {
        eyebrow: 'Contact',
        title: "Let's talk.",
        body: 'For roles, collaborations, press or partnerships.',
        follow: 'Follow'
    },
    footer: {
        rights: 'All rights reserved.'
    },
    ui: {
        close: 'Close',
        langLabel: 'Change language',
        watch: 'Watch',
        buy: 'Buy',
        open: 'Open'
    }
}

export const copy = { sq, en }

export type Copy = typeof sq
