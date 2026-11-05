/**
 * Which Hostinger app this build is for, from `VITE_SITE_ENV` (set in hPanel, read at build time
 * because every page is prerendered). Only `staging` changes anything: pages carry `noindex`,
 * robots.txt disallows everything and contact emails are flagged. A missing value means production,
 * so forgetting it on the live site can never hide it from search engines.
 */
export const isStaging = import.meta.env.VITE_SITE_ENV === 'staging'
