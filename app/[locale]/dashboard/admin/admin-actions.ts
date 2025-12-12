'use server'

import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { requireAdmin } from '@/lib/auth/admin-middleware'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { Query } from 'node-appwrite'

/**
 * Get all users with statistics
 */
export async function getAllUsers() {
    try {
        await requireAdmin()

        const { users } = await createAdminClient()

        // Fetch all users
        const usersList = await users.list()

        return {
            success: true,
            users: usersList.users.map(user => ({
                $id: user.$id,
                email: user.email,
                name: user.name,
                emailVerification: user.emailVerification,
                status: user.status,
                registration: user.registration,
                passwordUpdate: user.passwordUpdate,
                prefs: user.prefs
            })),
            total: usersList.total
        }
    } catch (error: any) {
        console.error('Get all users error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch users'
        }
    }
}

/**
 * Get system metrics and statistics
 */
export async function getSystemMetrics() {
    try {
        await requireAdmin()

        const { database } = await createAdminClient()

        // Get counts from all collections
        const [productsCount, storesCount, competitorsCount, pricesCount] = await Promise.all([
            database.listDocuments(APPWRITE_CONFIG.DATABASE_ID, APPWRITE_CONFIG.COLLECTIONS.PRODUCTS, [
                Query.limit(1)
            ]),
            database.listDocuments(APPWRITE_CONFIG.DATABASE_ID, APPWRITE_CONFIG.COLLECTIONS.STORES, [
                Query.limit(1)
            ]),
            database.listDocuments(APPWRITE_CONFIG.DATABASE_ID, APPWRITE_CONFIG.COLLECTIONS.COMPETITORS, [
                Query.limit(1)
            ]),
            database.listDocuments(APPWRITE_CONFIG.DATABASE_ID, APPWRITE_CONFIG.COLLECTIONS.PRICES, [
                Query.limit(1)
            ])
        ])

        return {
            success: true,
            metrics: {
                totalProducts: productsCount.total,
                totalStores: storesCount.total,
                totalCompetitors: competitorsCount.total,
                totalPriceRecords: pricesCount.total,
                timestamp: new Date().toISOString()
            }
        }
    } catch (error: any) {
        console.error('Get system metrics error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch system metrics'
        }
    }
}

/**
 * Get database statistics for all collections
 */
export async function getDatabaseStats() {
    try {
        await requireAdmin()

        const { database } = await createAdminClient()

        const collections = [
            { id: APPWRITE_CONFIG.COLLECTIONS.PRODUCTS, name: 'Products' },
            { id: APPWRITE_CONFIG.COLLECTIONS.STORES, name: 'Stores' },
            { id: APPWRITE_CONFIG.COLLECTIONS.COMPETITORS, name: 'Competitors' },
            { id: APPWRITE_CONFIG.COLLECTIONS.PRICES, name: 'Price History' },
            { id: APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS, name: 'Scraping Reports' }
        ]

        const stats = await Promise.all(
            collections.map(async (col) => {
                try {
                    const result = await database.listDocuments(
                        APPWRITE_CONFIG.DATABASE_ID,
                        col.id,
                        [Query.limit(1)]
                    )
                    return {
                        collection: col.name,
                        collectionId: col.id,
                        documentCount: result.total,
                        status: 'healthy'
                    }
                } catch (error) {
                    return {
                        collection: col.name,
                        collectionId: col.id,
                        documentCount: 0,
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                }
            })
        )

        return {
            success: true,
            stats
        }
    } catch (error: any) {
        console.error('Get database stats error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch database stats'
        }
    }
}

/**
 * Get scraping statistics
 */
export async function getScrapingStats() {
    try {
        await requireAdmin()

        const { database } = await createAdminClient()

        // Get all scraping reports
        const reports = await database.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS,
            [Query.limit(100), Query.orderDesc('$createdAt')]
        )

        // Calculate statistics
        const total = reports.total
        const pending = reports.documents.filter(r => r.status === 'pending').length
        const resolved = reports.documents.filter(r => r.status === 'resolved').length

        // Get recent reports (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const recentReports = reports.documents.filter(r => r.$createdAt > oneDayAgo)

        return {
            success: true,
            stats: {
                total,
                pending,
                resolved,
                recent24h: recentReports.length,
                successRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : '0'
            }
        }
    } catch (error: any) {
        console.error('Get scraping stats error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch scraping stats'
        }
    }
}

/**
 * Get user activity for a specific user
 */
export async function getUserActivity(userId: string) {
    try {
        await requireAdmin()

        const { database } = await createAdminClient()

        // Get user's products, stores, and activity
        const [products, stores, competitors] = await Promise.all([
            database.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                [Query.equal('userId', userId), Query.limit(100)]
            ),
            database.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.STORES,
                [Query.equal('userId', userId), Query.limit(100)]
            ),
            database.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
                [Query.equal('userId', userId), Query.limit(100)]
            )
        ])

        return {
            success: true,
            activity: {
                productsCount: products.total,
                storesCount: stores.total,
                competitorsCount: competitors.total,
                products: products.documents,
                stores: stores.documents
            }
        }
    } catch (error: any) {
        console.error('Get user activity error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch user activity'
        }
    }
}

/**
 * Toggle user ban status
 */
export async function toggleUserBan(userId: string, ban: boolean) {
    try {
        await requireAdmin()

        const { users } = await createAdminClient()

        // Update user status
        await users.updateStatus(userId, !ban)

        return {
            success: true,
            message: ban ? 'User banned successfully' : 'User unbanned successfully'
        }
    } catch (error: any) {
        console.error('Toggle user ban error:', error)
        return {
            success: false,
            error: error.message || 'Failed to update user status'
        }
    }
}

/**
 * Get analytics data for admin dashboard
 */
export async function getAnalyticsData() {
    try {
        await requireAdmin()

        const { database, users } = await createAdminClient()

        // Get user growth data
        const allUsers = await users.list()

        // Get products created over time
        const products = await database.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            [Query.limit(500), Query.orderDesc('$createdAt')]
        )

        // Calculate growth metrics
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        const recentUsers = allUsers.users.filter(u =>
            new Date(u.registration) > thirtyDaysAgo
        )

        const recentProducts = products.documents.filter(p =>
            new Date(p.$createdAt) > thirtyDaysAgo
        )

        return {
            success: true,
            analytics: {
                totalUsers: allUsers.total,
                newUsersLast30Days: recentUsers.length,
                totalProducts: products.total,
                newProductsLast30Days: recentProducts.length,
                userGrowthRate: allUsers.total > 0
                    ? ((recentUsers.length / allUsers.total) * 100).toFixed(1)
                    : '0'
            }
        }
    } catch (error: any) {
        console.error('Get analytics data error:', error)
        return {
            success: false,
            error: error.message || 'Failed to fetch analytics data'
        }
    }
}
