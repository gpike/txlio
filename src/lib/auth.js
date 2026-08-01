import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Returns { userId, orgId } from the current request context.
 * Throws if not authenticated.
 */
export async function requireAuth() {
  const { userId, orgId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return { userId, orgId }
}

/**
 * Returns the full Clerk user object, or null if not signed in.
 */
export async function getUser() {
  return currentUser()
}
