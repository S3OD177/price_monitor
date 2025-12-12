'use server'

import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { Query, ID } from 'node-appwrite'
import { revalidatePath } from 'next/cache'

const CHANGE_REQUEST_COLLECTION = 'product_change_requests'
const COMPETITOR_COLLECTION = APPWRITE_CONFIG.COLLECTIONS.COMPETITORS

export async function getPendingRequests() {
    try {
        const { databases } = await createAdminClient()

        const requests = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            CHANGE_REQUEST_COLLECTION,
            [
                Query.equal('status', 'pending'),
                Query.orderDesc('createdAt')
            ]
        )

        return { success: true, requests: requests.documents }
    } catch (error: any) {
        console.error('[getPendingRequests] Error:', error)
        return { success: false, error: error.message, requests: [] }
    }
}

export async function approveRequest(requestId: string, competitorId: string, changes: any) {
    try {
        const { databases } = await createAdminClient()

        // 1. Update the competitor product
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            competitorId,
            {
                name: changes.proposedName,
                sku: changes.proposedSku,
                price: changes.proposedPrice,
                currency: changes.proposedCurrency,
                // We could also track who approved it, but keeping it simple
            }
        )

        // 2. Update request status
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            CHANGE_REQUEST_COLLECTION,
            requestId,
            {
                status: 'approved'
            }
        )

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/products')
        return { success: true }
    } catch (error: any) {
        console.error('[approveRequest] Error:', error)
        return { success: false, error: error.message }
    }
}

export async function rejectRequest(requestId: string) {
    try {
        const { databases } = await createAdminClient()

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            CHANGE_REQUEST_COLLECTION,
            requestId,
            {
                status: 'rejected'
            }
        )

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        console.error('[rejectRequest] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get all scraping reports
 */
export async function getScrapingReports(status?: 'pending' | 'resolved' | 'all') {
    try {
        const { databases } = await createAdminClient()

        const queries = [Query.orderDesc('createdAt')]

        if (status && status !== 'all') {
            queries.push(Query.equal('status', status))
        }

        const reports = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS,
            queries
        )

        return { success: true, reports: reports.documents }
    } catch (error: any) {
        console.error('[getScrapingReports] Error:', error)
        return { success: false, error: error.message, reports: [] }
    }
}

/**
 * Mark a scraping report as resolved
 */
export async function markReportResolved(reportId: string, adminNotes?: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS,
            reportId,
            {
                status: 'resolved',
                resolvedAt: new Date().toISOString(),
                resolvedBy: user.$id,
                adminNotes: adminNotes || ''
            }
        )

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        console.error('[markReportResolved] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Delete a scraping report
 */
export async function deleteReport(reportId: string) {
    try {
        const { databases } = await createAdminClient()

        await databases.deleteDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS,
            reportId
        )

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        console.error('[deleteReport] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get product update requests
 */
export async function getProductUpdateRequests(status?: 'pending' | 'approved' | 'rejected') {
    try {
        const { databases } = await createAdminClient()

        const queries = [Query.orderDesc('createdAt')]

        if (status) {
            queries.push(Query.equal('status', status))
        }

        const requests = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            queries
        )

        return { success: true, requests: requests.documents }
    } catch (error: any) {
        console.error('[getProductUpdateRequests] Error:', error)
        return { success: false, error: error.message, requests: [] }
    }
}

/**
 * Approve a product update request
 */
export async function approveProductUpdate(requestId: string, markAsVerified: boolean = false) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // 1. Get the request
        const request = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            requestId
        )

        const proposedData = JSON.parse(request.proposedData)

        // 2. Find matching competitor product (by URL or SKU)
        // The request stores productUrl, let's try to find by URL first
        const competitors = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
            [Query.equal('url', request.productUrl)]
        )

        let competitorId = ''

        if (competitors.total > 0) {
            competitorId = competitors.documents[0].$id
        } else {
            // If not found by URL, try SKU + Region (assuming Saudi Arabia for now as default or check request)
            // But for simplicity, if not found, we might create new? 
            // The plan implies updating existing. If not found, maybe we should create?
            // Let's assume we update if found, create if not.
            competitorId = ID.unique()
        }

        const updateData: any = {
            name: proposedData.name,
            sku: proposedData.sku,
            imageUrl: proposedData.imageUrl,
            description: proposedData.description,
            // Price is NOT updated from user edits as per plan
            lastUpdated: new Date().toISOString(),
            updatedBy: request.userId
        }

        if (markAsVerified) {
            updateData.verified = true
        }

        if (competitors.total > 0) {
            await databases.updateDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
                competitorId,
                updateData
            )
        } else {
            // Create new if not exists (edge case)
            await databases.createDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
                competitorId,
                {
                    ...updateData,
                    url: request.productUrl,
                    price: proposedData.price || 0, // Fallback
                    currency: 'SAR', // Fallback
                    region: 'saudi_arabia', // Fallback
                    platform: 'other' // Fallback
                }
            )
        }

        // 3. Update request status
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            requestId,
            {
                status: 'approved',
                reviewedBy: user.$id,
                reviewedAt: new Date().toISOString()
            }
        )

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        console.error('[approveProductUpdate] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Reject a product update request
 */
export async function rejectProductUpdate(requestId: string, reason: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            requestId,
            {
                status: 'rejected',
                reviewedBy: user.$id,
                reviewedAt: new Date().toISOString(),
                adminNotes: reason
            }
        )

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        console.error('[rejectProductUpdate] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Toggle product verification status
 */
export async function toggleProductVerification(productId: string, verified: boolean) {
    try {
        const { databases } = await createAdminClient()

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.COMPETITORS,
            productId,
            {
                verified: verified
            }
        )

        revalidatePath('/dashboard/admin')
        revalidatePath('/dashboard/products')
        return { success: true }
    } catch (error: any) {
        console.error('[toggleProductVerification] Error:', error)
        return { success: false, error: error.message }
    }
}

