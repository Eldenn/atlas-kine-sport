import { createFileRoute, redirect } from '@tanstack/react-router'

// Address of the previous site: permanently redirected so links and search results keep working.
export const Route = createFileRoute('/a-propos')({
  beforeLoad: () => {
    throw redirect({ href: '/cabinet', statusCode: 301 })
  },
})
