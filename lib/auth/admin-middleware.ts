import { createSessionClient } from '@/lib/appwrite/server'

/**
 * Check if the current user is an admin
 * Currently uses email whitelist from environment variable
 * TODO: Implement proper RBAC system in production
 */
export async function isAdmin(): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
    try {
        const { account } = await createSessionClient()
        const user = await account.get()

        // Get admin emails from environment variable
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []

        const userEmail = user.email.toLowerCase()
        const isAdminUser = adminEmails.includes(userEmail)

        return {
            isAdmin: isAdminUser,
            userId: user.$id,
            email: user.email
        }
    } catch (error) {
        return { isAdmin: false }
    }
}

/**
 * Verify admin access and throw error if not authorized
 */
export async function requireAdmin() {
    const { isAdmin: isAdminUser, userId, email } = await isAdmin()

    if (!isAdminUser) {
        throw new Error('Unauthorized: Admin access required')
    }

    return { userId, email }
}

/**
 * Get admin emails list (for display purposes)
 */
export function getAdminEmails(): string[] {
    return process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
}
