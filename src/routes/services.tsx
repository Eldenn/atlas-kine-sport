import { createFileRoute, redirect } from '@tanstack/react-router'

// Address of the previous site: permanently redirected so links and search results keep working.
export const Route = createFileRoute('/services')({
  beforeLoad: () => {
    throw redirect({ href: '/soins', statusCode: 301 })
  },
})
