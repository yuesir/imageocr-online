export const PACKAGES = [
  { id: 'starter', name: 'Starter', cents: 599, credits: 100 },
  { id: 'plus', name: 'Plus', cents: 999, credits: 300 },
  { id: 'max', name: 'Max', cents: 1999, credits: 800 },
] as const
export type PackageId = typeof PACKAGES[number]['id']
export const GUEST_DAILY_LIMIT = 1
export const USER_DAILY_LIMIT = 2
export function findPackage(id: unknown) { return PACKAGES.find(p => p.id === id) }
