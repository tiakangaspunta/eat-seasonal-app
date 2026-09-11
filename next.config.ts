import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * `dev.ts` and `dev.tsx` are route extensions only while developing.
   *
   * `docs/PLAN.md` section 6: the parts of the app that write back into `data/`
   * must not exist in a production build. Naming a file `route.dev.ts` or
   * `page.dev.tsx` and leaving those extensions out of the production list
   * means it is not compiled into a route at all, rather than being built and
   * then refusing at request time.
   *
   * This covers the name-editing write route (issue 009) and the photo contact
   * sheet and its approval route (issue 010).
   */
  pageExtensions:
    process.env.NODE_ENV === 'development'
      ? ['ts', 'tsx', 'dev.ts', 'dev.tsx']
      : ['ts', 'tsx'],
}

export default nextConfig
