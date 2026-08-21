import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    devIndicators: false,

    // Every image on the site is a plain <img> — nothing uses next/image — so
    // the optimizer is dead weight here. Declaring this explicitly also makes
    // `sharp` provably irrelevant, which is what Vercel's npm 11 warns about
    // during install ("sharp has install scripts not yet covered by
    // allowScripts"). That warning is cosmetic: the package is an optional
    // transitive dependency this site never calls.
    images: {
        unoptimized: true
    },

    experimental: {
        optimizePackageImports: ['lucide-react']
    }

    // Removed, all inherited from the boilerplate's original host and wrong for
    // Vercel:
    //   output: 'standalone'      Vercel does its own packaging.
    //   experimental.cpus: 1      Capped the builder to one core.
    //   experimental.workerThreads: false
    //   typescript.ignoreBuildErrors: true
    //     ^ the dangerous one: a type error would have shipped silently rather
    //       than failing the build. `npm run typecheck` passes, so this is now
    //       enforced on every deploy.
}

export default nextConfig
