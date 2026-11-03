import { createFileRoute, redirect } from '@tanstack/react-router'

// Address of the previous site: permanently redirected so links and search results keep working.
export const Route = createFileRoute('/moeine-khalifeh')({
  beforeLoad: () => {
    throw redirect({ href: '/equipe/moeine-khalifeh', statusCode: 301 })
  },
})
