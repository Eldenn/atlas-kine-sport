// Copies the Coreloom UI registry items listed in coreloom.json (and their @coreloom
// dependencies) from a local coreloom-ui checkout, at the paths `shadcn add` would write them,
// and lists the npm packages they need that package.json doesn't declare yet.
//   node scripts/sync-coreloom.mjs ../coreloom-ui           copy
//   node scripts/sync-coreloom.mjs ../coreloom-ui --check   fail if a file differs (CI)
// Same result as `pnpm dlx shadcn@latest add @coreloom/<name> --overwrite`, without the network.
import fs from 'node:fs'
import path from 'node:path'

const [source] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const check = process.argv.includes('--check')
if (!source) {
  console.error('Usage: node scripts/sync-coreloom.mjs <path-to-coreloom-ui> [--check]')
  process.exit(1)
}

const root = path.resolve(import.meta.dirname, '..')
const from = path.resolve(source)
const registry = JSON.parse(fs.readFileSync(path.join(from, 'registry.json'), 'utf8'))
const { items: wanted } = JSON.parse(fs.readFileSync(path.join(root, 'coreloom.json'), 'utf8'))
const byName = new Map(registry.items.map((item) => [item.name, item]))

const needed = new Set()
const visit = (name) => {
  if (needed.has(name)) return
  const item = byName.get(name)
  if (!item) throw new Error(`coreloom.json: no registry item "${name}" in ${from}`)
  needed.add(name)
  for (const dep of item.registryDependencies ?? [])
    if (dep.startsWith('@coreloom/')) visit(dep.slice('@coreloom/'.length))
}
wanted.forEach(visit)

const files = new Map()
const npm = new Set()
for (const name of needed) {
  const item = byName.get(name)
  for (const file of item.files ?? []) files.set(file.target ?? file.path, file.path)
  for (const dep of item.dependencies ?? []) npm.add(dep.replace(/(?<=.)@[^/]*$/, ''))
}

const problems = []
for (const [target, src] of files) {
  const content = fs.readFileSync(path.join(from, src))
  const to = path.join(root, target)
  if (check) {
    if (!fs.existsSync(to) || !fs.readFileSync(to).equals(content))
      problems.push(`${target} differs`)
  } else {
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.writeFileSync(to, content)
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const declared = { ...pkg.dependencies, ...pkg.devDependencies }
for (const dep of npm) if (!declared[dep]) problems.push(`package.json is missing "${dep}"`)

console.log(`${needed.size} items, ${files.size} files${check ? ' checked' : ' copied'}.`)
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
