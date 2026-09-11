import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * `dev.ts` is a route extension only while developing.
   *
   * `docs/PLAN.md` section 6: the name-editing write route must not exist in a
   * production build. Naming it `route.dev.ts` and leaving that extension out
   * of the production list means the file is not compiled into a route at all,
   * rather than being built and then refusing at request time.
   */
  pageExtensions:
    process.env.NODE_ENV === 'development'
      ? ['ts', 'tsx', 'dev.ts']
      : ['ts', 'tsx'],
}

export default nextConfig
