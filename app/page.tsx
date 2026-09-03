export default function HomePage() {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-semibold md:text-3xl">Eat seasonal</h1>
      <p className="mt-4 text-neutral-700">
        The home view arrives in issue 007. Until then,{' '}
        <a href="/preview" className="text-sky-700 underline">
          the data preview
        </a>{' '}
        shows what is in <code>data/</code>.
      </p>
    </main>
  )
}
