import { createFileRoute, redirect } from '@tanstack/react-router'

// Address of the previous site: permanently redirected so links and search results keep working.
export const Route = createFileRoute('/delman-ahmed-mustafa')({
  beforeLoad: () => {
    throw redirect({ href: '/equipe/delman-ahmed-mustafa', statusCode: 301 })
  },
})
