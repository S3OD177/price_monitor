'use server'

import { createSessionClient, createAdminClient } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/lib/appwrite/config"
import { ID, Query } from "node-appwrite"
import { scrapeProductInfo } from "@/lib/scraper/product-scraper"
import { revalidatePath } from "next/cache"

export async function addProduct(url: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Basic URL validation
        try {
            new URL(url)
        } catch (e) {
            return { success: false, error: "Invalid URL" }
        }

        // Determine platform
        let platform = 'other'
        if (url.includes('salla.sa')) platform = 'salla'
        if (url.includes('trendyol.com')) platform = 'trendyol'

        // Scrape product information
        let productData = {
            name: "Imported Product (Pending)",
            price: 0,
            currency: "SAR",
            stock: 0,
            imageUrl: undefined as string | undefined,
            description: undefined as string | undefined,
            sku: undefined as string | undefined,
            originalPrice: undefined as number | undefined
        }

        try {
            const scrapedData = await scrapeProductInfo(url)
            productData = {
                name: scrapedData.name || productData.name,
                price: scrapedData.price || productData.price,
                currency: scrapedData.currency || productData.currency,
                stock: scrapedData.stock ?? productData.stock,
                imageUrl: scrapedData.imageUrl,
                description: scrapedData.description,
                sku: scrapedData.sku,
                originalPrice: scrapedData.originalPrice
            }
        } catch (scrapeError: any) {
            console.warn('[addProduct] Scraping failed, using defaults:', scrapeError.message)
            // Continue with default values if scraping fails
        }

        // Create product document
        const docId = ID.unique()

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            docId,
            {
                name: productData.name,
                url: url,
                platform: platform,
                price: productData.price,
                currency: productData.currency,
                stock: productData.stock,
                imageUrl: productData.imageUrl,
                description: productData.description,
                sku: productData.sku,
                originalPrice: productData.originalPrice,
                userId: user.$id,
                user_id: user.$id, // Keep both for schema compatibility
                status: "active",
                createdAt: new Date().toISOString()
            }
        )

        // Auto-sync to shared CompetitorProducts database
        // This allows other users to benefit from this product data
        if (productData.price > 0 && url) {
            try {
                // Check if URL already exists in shared database
                const existing = await databases.listDocuments(
                    APPWRITE_CONFIG.DATABASE_ID,
                    'CompetitorProducts',
                    [Query.equal('url', url)]
                )

                // Determine region
                const region = url.includes('.sa') || url.includes('salla.sa') ? 'saudi_arabia' : 'other'

                const sharedData = {
                    url: url,
                    name: productData.name,
                    price: productData.price,
                    originalPrice: productData.originalPrice,
                    currency: productData.currency,
                    sku: productData.sku,
                    imageUrl: productData.imageUrl,
                    description: productData.description,
                    platform: platform,
                    region: region,
                    stock: productData.stock,
                    lastScraped: new Date().toISOString(),
                    scrapedBy: user.$id,
                    verified: true
                }

                if (existing.total > 0) {
                    // Update existing entry
                    await databases.updateDocument(
                        APPWRITE_CONFIG.DATABASE_ID,
                        'CompetitorProducts',
                        existing.documents[0].$id,
                        sharedData
                    )
                } else {
                    // Create new entry in shared database
                    await databases.createDocument(
                        APPWRITE_CONFIG.DATABASE_ID,
                        'CompetitorProducts',
                        ID.unique(),
                        sharedData
                    )
                }

                console.log('[addProduct] Product synced to shared database')
            } catch (syncError: any) {
                console.warn('[addProduct] Failed to sync to shared database:', syncError.message)
                // Don't fail the main operation if sync fails
            }
        }

        revalidatePath('/dashboard/products')
        return { success: true }
    } catch (error: any) {
        console.error('[addProduct] Failed to add product:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get product to verify ownership
        const product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        // Verify ownership
        if (product.userId !== user.$id && product.user_id !== user.$id) {
            return { success: false, error: "Unauthorized" }
        }

        // Delete product
        await databases.deleteDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        revalidatePath('/dashboard/products')
        return { success: true }
    } catch (error: any) {
        console.error('[deleteProduct] Failed to delete product:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update a product
 */
/**
 * Update a product
 */
export async function updateProduct(productId: string, data: {
    name?: string
    sku?: string
    imageUrl?: string
    description?: string
    status?: string
    submitToCommunity?: boolean
    reason?: string
}) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get product to verify ownership
        const product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        // Verify ownership
        if (product.userId !== user.$id && product.user_id !== user.$id) {
            return { success: false, error: "Unauthorized" }
        }

        // Update product in user's collection
        // Note: Price is excluded from updates as it's managed by scraper
        const updateData: any = {
            name: data.name,
            sku: data.sku,
            imageUrl: data.imageUrl,
            description: data.description,
            status: data.status
        }

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        )

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId,
            updateData
        )

        // Handle community submission if requested
        if (data.submitToCommunity) {
            try {
                await submitProductUpdateRequest({
                    productId,
                    userId: user.$id,
                    productUrl: product.url,
                    currentData: {
                        name: product.name,
                        sku: product.sku,
                        imageUrl: product.imageUrl,
                        description: product.description,
                        price: product.price
                    },
                    proposedData: {
                        name: data.name || product.name,
                        sku: data.sku || product.sku,
                        imageUrl: data.imageUrl || product.imageUrl,
                        description: data.description || product.description,
                        price: product.price // Price doesn't change
                    },
                    reason: data.reason
                })
            } catch (submissionError) {
                console.error('[updateProduct] Failed to submit update request:', submissionError)
                // Don't fail the main update if submission fails, but maybe warn?
                // For now we just log it.
            }
        }

        revalidatePath('/dashboard/products')
        revalidatePath(`/dashboard/products/${productId}`)
        return { success: true }
    } catch (error: any) {
        console.error('[updateProduct] Failed to update product:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Submit a request to update the community database
 */
async function submitProductUpdateRequest(data: {
    productId: string
    userId: string
    productUrl: string
    currentData: any
    proposedData: any
    reason?: string
}) {
    const { databases } = await createAdminClient()

    // Calculate changed fields
    const changedFields = []
    if (data.currentData.name !== data.proposedData.name) changedFields.push('name')
    if (data.currentData.sku !== data.proposedData.sku) changedFields.push('sku')
    if (data.currentData.imageUrl !== data.proposedData.imageUrl) changedFields.push('imageUrl')
    if (data.currentData.description !== data.proposedData.description) changedFields.push('description')

    if (changedFields.length === 0) return // No changes to submit

    // Check for existing pending request for this product by this user
    const existingRequests = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        'product_update_requests',
        [
            Query.equal('productId', data.productId),
            Query.equal('userId', data.userId),
            Query.equal('status', 'pending')
        ]
    )

    if (existingRequests.total > 0) {
        // Update existing request
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            existingRequests.documents[0].$id,
            {
                proposedData: JSON.stringify(data.proposedData),
                changedFields: JSON.stringify(changedFields),
                reason: data.reason,
                updatedAt: new Date().toISOString()
            }
        )
    } else {
        // Create new request
        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_update_requests',
            ID.unique(),
            {
                productId: data.productId,
                userId: data.userId,
                productUrl: data.productUrl,
                currentData: JSON.stringify(data.currentData),
                proposedData: JSON.stringify(data.proposedData),
                changedFields: JSON.stringify(changedFields),
                reason: data.reason,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        )
    }
}

export async function getProducts(query?: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()

        // Verify session and get user
        const user = await account.get()

        const queries = [
            Query.equal('userId', user.$id), // Filter by user
            Query.orderDesc('$createdAt')
        ]

        if (query) {
            queries.push(Query.search('name', query))
        }

        const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            queries
        )

        return { success: true, products: response.documents }
    } catch (error: any) {
        console.error('[getProducts] Failed to fetch products:', error)
        return { success: false, error: error.message, products: [] }
    }
}

/**
 * Search for products by SKU in Saudi Arabia stores
 */
export async function addProductBySKU(sku: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        await account.get() // Verify authentication

        if (!sku || sku.trim().length === 0) {
            return { success: false, error: "SKU is required" }
        }

        // Search CompetitorProducts database for matching SKU in Saudi Arabia
        const competitors = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            'CompetitorProducts',
            [
                Query.equal('sku', sku.trim()),
                Query.equal('region', 'saudi_arabia'),
                Query.orderDesc('lastScraped'),
                Query.limit(20)
            ]
        )

        if (competitors.total === 0) {
            return {
                success: false,
                error: "No products found with this SKU in Saudi Arabia stores"
            }
        }

        return {
            success: true,
            competitors: competitors.documents,
            count: competitors.total
        }
    } catch (error: any) {
        console.error('[addProductBySKU] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Confirm and add product from SKU search results
 */
export async function confirmProductAddition(data: {
    name: string
    sku: string
    price: number
    currency: string
    imageUrl?: string
    description?: string
    originalPrice?: number
    competitorUrls: string[]
    platform: string
}) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Create product document
        const docId = ID.unique()

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            docId,
            {
                name: data.name,
                url: data.competitorUrls[0] || '', // Use first competitor URL as primary
                platform: data.platform,
                price: data.price,
                currency: data.currency,
                stock: 100, // Default stock
                imageUrl: data.imageUrl,
                description: data.description,
                sku: data.sku,
                originalPrice: data.originalPrice,
                userId: user.$id,
                user_id: user.$id,
                status: "active",
                createdAt: new Date().toISOString(),
                competitorUrls: data.competitorUrls
            }
        )

        revalidatePath('/dashboard/products')
        return { success: true, productId: docId }
    } catch (error: any) {
        console.error('[confirmProductAddition] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Report incorrect scraping results to admin
 */
export async function reportScrapingIssue(data: {
    productUrl: string
    reportedSku?: string
    expectedSku?: string
    productName?: string
    issue: string
}) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.SCRAPING_REPORTS,
            ID.unique(),
            {
                productUrl: data.productUrl,
                reportedSku: data.reportedSku || '',
                expectedSku: data.expectedSku || '',
                reportedBy: user.$id,
                productName: data.productName || '',
                issue: data.issue,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        )

        return { success: true }
    } catch (error: any) {
        console.error('[reportScrapingIssue] Error:', error)
        return { success: false, error: error.message }
    }
}

