// Writes one changeset per releasable commit on main since the last release, from its
// Conventional Commits subject (the squash-merged PR title):
//   feat → minor, fix / perf → patch, `!` after the type or a "BREAKING CHANGE" footer → major.
// Other types (docs, ci, chore, build, refactor, style, test, revert) are not released.
// Run by .github/workflows/release.yml before `changeset version`; prints how many it wrote.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

/** The last release tag, or (before the first one) the commit before Changesets was set up. */
function baseRef() {
  try {
    return git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*', 'HEAD')
  } catch {
    const added = git('log', '--diff-filter=A', '--format=%H', '--', '.changeset/config.json')
      .split('\n')
      .filter(Boolean)
      .at(-1)
    return added ? `${added}^` : null
  }
}

const SUBJECT = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?: (?<description>.+)$/

export function bumpFor(subject, body) {
  const match = SUBJECT.exec(subject)
  if (!match) return null
  const { type, breaking } = match.groups
  if (breaking || /^BREAKING[ -]CHANGE: /m.test(body)) return 'major'
  if (type === 'feat') return 'minor'
  if (type === 'fix' || type === 'perf') return 'patch'
  return null
}

const name = JSON.parse(git('show', 'HEAD:package.json')).name
const base = baseRef()
const range = base ? `${base}..HEAD` : 'HEAD'
const log = git('log', '--first-parent', '--format=%H%x1f%s%x1f%b%x1e', range)

let written = 0
for (const entry of log.split('\x1e')) {
  const [sha, subject, body = ''] = entry.trim().split('\x1f')
  if (!sha) continue
  const bump = bumpFor(subject, body)
  if (!bump) continue
  const summary = SUBJECT.exec(subject).groups.description
  writeFileSync(
    `.changeset/commit-${sha.slice(0, 7)}.md`,
    `---\n'${name}': ${bump}\n---\n\n${summary}\n`,
  )
  written++
}
console.log(written)
