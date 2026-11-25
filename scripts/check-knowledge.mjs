/**
 * Validate repository knowledge without dependencies, network access or writes.
 * Run from any directory: node scripts/check-knowledge.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const warnings = []
const read = name => fs.readFileSync(path.join(root, name), 'utf8')
const config = JSON.parse(read('docs/knowledge-checks.json'))

// 1. Registered documents must exist.
for (const name of config.documents) {
  if (!fs.existsSync(path.join(root, name))) failures.push(`Missing document: ${name}`)
}

// 2. Every Markdown under managed directories must be registered.
const markdowns = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return markdowns(full)
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : []
  })
const docsMarkdowns = markdowns(path.join(root, 'docs'))
const registered = new Set(config.documents)
for (const file of docsMarkdowns) {
  const relative = path.relative(root, file).split(path.sep).join('/')
  if (!registered.has(relative)) failures.push(`Unregistered document: ${relative}`)
}

// 3. Local Markdown links (fenced code excluded) must resolve.
let links = 0
for (const file of [path.join(root, 'AGENTS.md'), ...docsMarkdowns]) {
  const text = fs.readFileSync(file, 'utf8')
  const relative = path.relative(root, file).split(path.sep).join('/')
  const content = text.replace(/```[^\n]*\n[\s\S]*?```/g, '')
  for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const raw = match[1].trim().replace(/^<|>$/g, '')
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(raw)) continue
    const local = raw.split(/[?#]/, 1)[0]
    let target
    try {
      target = path.resolve(path.dirname(file), decodeURIComponent(local))
    } catch {
      failures.push(`${relative}: malformed link ${raw}`)
      continue
    }
    if (!fs.existsSync(target)) failures.push(`${relative}: broken link ${raw}`)
    links++
  }
}

// 4. Book order: chapter dir exists, heading is "# 第N章", linked from book index.
const bookIndex = read('docs/README.md')
for (const [index, chapter] of (config.chapters ?? []).entries()) {
  const full = path.join(root, 'docs', chapter)
  const chapterReadme = path.join(full, 'README.md')
  if (!fs.existsSync(full) || !fs.existsSync(chapterReadme)) {
    failures.push(`Missing chapter ${index + 1}: ${chapter}`)
    continue
  }
  const heading = fs.readFileSync(chapterReadme, 'utf8').split(/\r?\n/, 1)[0]
  if (!heading.startsWith(`# 第${index + 1}章`)) {
    failures.push(`Wrong chapter heading: ${chapter}: ${heading}`)
  }
  if (!bookIndex.includes(`](${chapter})`) && !bookIndex.includes(`](${chapter}/)`)) {
    failures.push(`Chapter missing from book index: ${chapter}`)
  }
}

// 5. Every chapter section (except exempt) must appear in the book index.
const exempt = new Set(config.tocExempt ?? [])
for (const name of config.documents) {
  if (exempt.has(name) || !/^docs\/\d\d-/.test(name) || name.endsWith('/README.md')) continue
  if (!bookIndex.includes(`](${name.slice('docs/'.length)})`)) {
    failures.push(`Section missing from book index: ${name}`)
  }
}

// 6. Registered source paths must exist.
for (const name of config.requiredPaths) {
  if (!fs.existsSync(path.join(root, name))) failures.push(`Missing source path: ${name}`)
}

// 7. Keep the entry file short.
const agentLines = read('AGENTS.md').trimEnd().split(/\r?\n/).length
if (agentLines > 150) failures.push(`AGENTS.md has ${agentLines} lines, limit 150`)

for (const w of warnings) console.warn(`WARN: ${w}`)
for (const f of failures) console.error(`FAIL: ${f}`)
console.log(`Book check: ${(config.chapters ?? []).length} ordered chapters, ${docsMarkdowns.length} handbook documents.`)
console.log(`Checked ${config.documents.length} registered documents, ${links} local links, ${config.requiredPaths.length} source paths; AGENTS.md ${agentLines} lines.`)
console.log('Links/registration/order only: no compile, test, network, external URL or semantic verification performed.')
process.exitCode = failures.length ? 1 : 0
