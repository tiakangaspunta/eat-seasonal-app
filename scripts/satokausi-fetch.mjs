/**
 * Fetch and parse the season table off satokausi.fi ingredient pages.
 *
 * Each page carries a "Sesonki" row whose cell reads like
 *   Tammikuu-Huhtikuu:<br><span class="season-with-flags">Varastosesonki<img alt="FIN"></span>
 * which is exactly the storage / in-season / peak split the data model wants.
 * Parsed here rather than summarised, so the months are what the page says.
 *
 * Usage: node scripts/satokausi-fetch.mjs <slug> [slug...] > out.json
 */
const MONTHS = ['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesakuu',
  'heinakuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu']

const norm = (s) => s.toLowerCase().replace(/[äå]/g, 'a').replace(/ö/g, 'o').trim()
const monthNo = (name) => MONTHS.indexOf(norm(name)) + 1

function expand(from, to) {
  const a = monthNo(from), b = monthNo(to || from)
  if (!a || !b) return []
  const out = []
  for (let m = a; ; m = (m % 12) + 1) { out.push(m); if (m === b) break }
  return out
}

const BUCKET = {
  varastosesonki: 'storage',
  sesongissa: 'fresh',
  huippusesonki: 'peak',
}

export function parseSeason(html) {
    const cell = html.match(/<th>Sesonki<\/th><td>([\s\S]*?)<\/td>/)
  if (!cell) return null
  const rows = []
    const re = /([A-Za-zÄÖäöå]+)(?:\s*[-–]\s*([A-Za-zÄÖäöå]+))?\s*:\s*<br\s*\/?>\s*<span class="season-with-flags">\s*([A-Za-zÄÖäöå]+)([\s\S]*?)<\/span>/g
  let m
  while ((m = re.exec(cell[1])) !== null) {
    const bucket = BUCKET[norm(m[3])]
    if (!bucket) continue
        const flags = [...m[4].matchAll(/alt="([A-Z]{2,3})"/g)].map((f) => f[1])
    rows.push({ months: expand(m[1], m[2]), bucket, flags })
  }
  return rows
}

async function main() {
  const slugs = process.argv.slice(2)
  const out = {}
  for (const slug of slugs) {
    const url = `https://satokausi.fi/raaka-aineet/${slug}/`
    const res = await fetch(url)
    if (!res.ok) { out[slug] = { error: res.status }; continue }
    const html = await res.text()
        const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]
    out[slug] = {
      url,
            title: title ? title.replace(/<[^>]*>/g, '').trim() : null,
      season: parseSeason(html),
    }
    process.stderr.write(`${slug} ok\n`)
  }
  process.stdout.write(JSON.stringify(out, null, 2))
}

main()
