'use server'

import { createSessionClient, createAdminClient } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/lib/appwrite/config"
import { scrapeProductInfo } from "@/lib/scraper/product-scraper"
import { ID, Query } from "node-appwrite"
import { revalidatePath } from "next/cache"

const COMPETITOR_COLLECTION = "CompetitorProducts"

/**
 * Scrape a competitor URL and return data for user verification
 * Silently checks shared database first - user doesn't know if data came from cache
 */
export async function scrapeCompetitorUrl(url: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        await account.get() // Verify authentication

        // Validate URL
        try {
            new URL(url)
        } catch (e) {
            return { success: false, error: "Invalid URL" }
        }

        // Check if URL is from Saudi Arabia
        const isSaudiArabia = url.includes('salla.sa') ||
            url.includes('.sa/') ||
            url.includes('saudi') ||
            url.includes('ksa')

        if (!isSaudiArabia) {
            return { success: false, error: "Only Saudi Arabia competitors are supported" }
        }

        // First, check if this URL exists in shared database (silently)
        // User doesn't know if data came from another user or fresh scraping
        try {
            const existing = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                COMPETITOR_COLLECTION,
                [Query.equal('url', url)]
            )

            if (existing.total > 0) {
                const cachedProduct = existing.documents[0]

                // Return cached data as if we just scraped it
                // Completely transparent to the user
                return {
                    success: true,
                    data: {
                        url: cachedProduct.url,
                        name: cachedProduct.name,
                        price: cachedProduct.price,
                        originalPrice: cachedProduct.originalPrice,
                        currency: cachedProduct.currency,
                        sku: cachedProduct.sku,
                        imageUrl: cachedProduct.imageUrl,
                        description: cachedProduct.description,
                        platform: cachedProduct.platform,
                        region: cachedProduct.region,
                        stock: cachedProduct.stock
                    }
                }
            }
        } catch (dbError) {
            // If database check fails, continue to scraping
            console.warn('[scrapeCompetitorUrl] Database check failed, will scrape:', dbError)
        }

        // If not in database, scrape the URL
        const scrapedData = await scrapeProductInfo(url)

        // Determine platform and region
        let platform = 'other'
        if (url.includes('salla.sa')) platform = 'salla'
        if (url.includes('trendyol.com')) platform = 'trendyol'

        return {
            success: true,
            data: {
                url,
                ...scrapedData,
                platform,
                region: 'saudi_arabia'
            }
        }
    } catch (error: any) {
        console.error('[scrapeCompetitorUrl] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Save verified competitor data to shared database
 */
export async function saveCompetitorProduct(data: any) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Check if URL already exists in shared database
        const existing = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            [Query.equal('url', data.url)]
        )

        if (existing.total > 0) {
            // Update existing entry
            await databases.updateDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                COMPETITOR_COLLECTION,
                existing.documents[0].$id,
                {
                    name: data.name,
                    price: data.price,
                    originalPrice: data.originalPrice,
                    currency: data.currency,
                    sku: data.sku,
                    imageUrl: data.imageUrl,
                    description: data.description,
                    platform: data.platform,
                    region: data.region,
                    stock: data.stock,
                    lastScraped: new Date().toISOString(),
                    scrapedBy: user.$id,
                    verified: true
                }
            )

            return { success: true, competitorId: existing.documents[0].$id }
        } else {
            // Create new entry
            const doc = await databases.createDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                COMPETITOR_COLLECTION,
                ID.unique(),
                {
                    url: data.url,
                    name: data.name,
                    price: data.price,
                    originalPrice: data.originalPrice,
                    currency: data.currency,
                    sku: data.sku,
                    imageUrl: data.imageUrl,
                    description: data.description,
                    platform: data.platform,
                    region: data.region,
                    stock: data.stock,
                    lastScraped: new Date().toISOString(),
                    scrapedBy: user.$id,
                    verified: true
                }
            )

            return { success: true, competitorId: doc.$id }
        }
    } catch (error: any) {
        console.error('[saveCompetitorProduct] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Find competitors by SKU in Saudi Arabia
 */
export async function findCompetitorsBySKU(sku: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        await account.get() // Verify authentication

        if (!sku) {
            return { success: true, competitors: [] }
        }

        const competitors = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            [
                Query.equal('sku', sku),
                Query.equal('region', 'saudi_arabia'),
                Query.orderDesc('lastScraped'),
                Query.limit(10)
            ]
        )

        return { success: true, competitors: competitors.documents }
    } catch (error: any) {
        console.error('[findCompetitorsBySKU] Error:', error)
        return { success: false, error: error.message, competitors: [] }
    }
}

/**
 * Get competitors by their URLs
 */
export async function getCompetitorsByUrls(urls: string[]) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        await account.get() // Verify authentication

        if (!urls || urls.length === 0) {
            return { success: true, competitors: [] }
        }

        // Appwrite Query.equal supports array for 'OR' logic
        const competitors = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            [
                Query.equal('url', urls),
                Query.limit(urls.length)
            ]
        )

        return { success: true, competitors: competitors.documents }
    } catch (error: any) {
        console.error('[getCompetitorsByUrls] Error:', error)
        return { success: false, error: error.message, competitors: [] }
    }
}

/**
 * Add competitor URL to user's product tracking
 */
export async function addCompetitorToProduct(productId: string, competitorUrl: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get current product
        const product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        // Verify ownership
        if (product.userId !== user.$id && product.user_id !== user.$id) {
            return { success: false, error: "Unauthorized" }
        }

        // Get current competitor URLs
        const currentUrls = product.competitorUrls || []

        // Add new URL if not already present
        if (!currentUrls.includes(competitorUrl)) {
            currentUrls.push(competitorUrl)

            await databases.updateDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                productId,
                {
                    competitorUrls: currentUrls
                }
            )
        }

        revalidatePath(`/dashboard/products/${productId}`)
        return { success: true }
    } catch (error: any) {
        console.error('[addCompetitorToProduct] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Get competitor prices for a product
 */
export async function getCompetitorPrices(productId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get product
        const product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        // Verify ownership
        if (product.userId !== user.$id && product.user_id !== user.$id) {
            return { success: false, error: "Unauthorized", competitors: [] }
        }

        const competitorUrls = product.competitorUrls || []
        const competitors = []

        // Fetch competitor data from shared database
        for (const url of competitorUrls) {
            const result = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                COMPETITOR_COLLECTION,
                [Query.equal('url', url)]
            )

            if (result.total > 0) {
                competitors.push(result.documents[0])
            }
        }

        return { success: true, competitors }
    } catch (error: any) {
        console.error('[getCompetitorPrices] Error:', error)
        return { success: false, error: error.message, competitors: [] }
    }
}

/**
 * Force scrape a competitor URL, bypassing cache
 */
export async function forceScrapeCompetitor(competitorId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get competitor document
        const competitor = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            competitorId
        )

        // Scrape fresh data
        const scrapedData = await scrapeProductInfo(competitor.url)

        // Update document
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            COMPETITOR_COLLECTION,
            competitorId,
            {
                name: scrapedData.name,
                price: scrapedData.price,
                originalPrice: scrapedData.originalPrice,
                currency: scrapedData.currency,
                sku: scrapedData.sku,
                imageUrl: scrapedData.imageUrl,
                description: scrapedData.description,
                stock: scrapedData.stock,
                lastScraped: new Date().toISOString(),
                scrapedBy: user.$id
            }
        )

        revalidatePath('/dashboard/products')
        return { success: true }
    } catch (error: any) {
        console.error('[forceScrapeCompetitor] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Scrape all competitors for a product
 */
export async function scrapeAllCompetitors(productId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        // Get all competitors for this product
        const competitorsResult = await getCompetitorPrices(productId)
        if (!competitorsResult.success || competitorsResult.competitors.length === 0) {
            return { success: false, error: 'No competitors to scrape' }
        }

        const competitors = competitorsResult.competitors
        let successCount = 0
        let failCount = 0

        // Scrape each competitor
        for (const competitor of competitors) {
            try {
                const scrapedData = await scrapeProductInfo(competitor.url)

                await databases.updateDocument(
                    APPWRITE_CONFIG.DATABASE_ID,
                    COMPETITOR_COLLECTION,
                    competitor.$id,
                    {
                        name: scrapedData.name,
                        price: scrapedData.price,
                        originalPrice: scrapedData.originalPrice,
                        currency: scrapedData.currency,
                        sku: scrapedData.sku,
                        imageUrl: scrapedData.imageUrl,
                        description: scrapedData.description,
                        stock: scrapedData.stock,
                        lastScraped: new Date().toISOString(),
                        scrapedBy: user.$id
                    }
                )
                successCount++
            } catch (error) {
                console.error(`Failed to scrape competitor ${competitor.$id}:`, error)
                failCount++
            }
        }

        revalidatePath('/dashboard/products')
        return {
            success: true,
            message: `Scraped ${successCount} competitors successfully${failCount > 0 ? `, ${failCount} failed` : ''}`
        }
    } catch (error: any) {
        console.error('[scrapeAllCompetitors] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Submit a product change request
 */
export async function submitChangeRequest(data: {
    competitorId: string
    proposedName: string
    proposedSku: string
    proposedPrice: number
    proposedCurrency: string
}) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            'product_change_requests',
            ID.unique(),
            {
                competitorId: data.competitorId,
                userId: user.$id,
                proposedName: data.proposedName,
                proposedSku: data.proposedSku,
                proposedPrice: data.proposedPrice,
                proposedCurrency: data.proposedCurrency,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        )

        return { success: true }
    } catch (error: any) {
        console.error('[submitChangeRequest] Error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Search the web for competitors using SKU
 * Uses Gemini AI first, then Brave Search as fallback
 */
export async function searchWebForCompetitors(sku: string, productId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()
        const user = await account.get()

        const { searchWithGemini, searchWithBrave, scrapeWithJina } = await import('@/lib/web-search')

        // Get product details for smart search
        const product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            productId
        )

        // Phase 1: Try Gemini AI (Smart Search with Fallback & Validation)
        console.log('[searchWebForCompetitors] Searching with Gemini AI...')
        const geminiResults = await searchWithGemini(sku, product.name, product.price)

        // Filter out low confidence or suspicious results
        const highConfidenceResults = geminiResults.filter(r =>
            (r.confidence === undefined || r.confidence > 60) &&
            !r.matchReason?.includes('suspicious_price')
        )

        let allResults = [...highConfidenceResults]

        // Phase 2: If Gemini found less than 3 results, try Brave Search
        if (highConfidenceResults.length < 3 && process.env.BRAVE_API_KEY) {
            console.log('[searchWebForCompetitors] Searching with Brave API...')
            const braveUrls = await searchWithBrave(sku)

            // Scrape each URL with Jina AI
            const braveResults = await Promise.all(
                braveUrls.slice(0, 5).map(async (url) => {
                    const scraped = await scrapeWithJina(url)
                    return scraped ? { ...scraped, sku } : null
                })
            )

            allResults.push(...braveResults.filter(r => r !== null) as any[])
        }

        // Remove duplicates by URL
        const uniqueResults = Array.from(
            new Map(allResults.map(r => [r.url, r])).values()
        )

        // Save to CompetitorProducts collection
        const savedCompetitors = []
        for (const result of uniqueResults) {
            try {
                // Check if URL already exists
                const existing = await databases.listDocuments(
                    APPWRITE_CONFIG.DATABASE_ID,
                    COMPETITOR_COLLECTION,
                    [Query.equal('url', result.url)]
                )

                if (existing.total === 0) {
                    // Create new competitor product
                    const competitor = await databases.createDocument(
                        APPWRITE_CONFIG.DATABASE_ID,
                        COMPETITOR_COLLECTION,
                        ID.unique(),
                        {
                            url: result.url,
                            name: result.name || 'Unknown Product',
                            price: result.price || 0,
                            currency: result.currency || 'SAR',
                            sku: sku,
                            platform: result.platform || 'other',
                            imageUrl: result.imageUrl,
                            lastScraped: new Date().toISOString(),
                            scrapedBy: user.$id,
                            discoveredVia: 'web_search'
                        }
                    )
                    savedCompetitors.push(competitor)
                } else {
                    savedCompetitors.push(existing.documents[0])
                }
            } catch (error) {
                console.error('[searchWebForCompetitors] Error saving competitor:', error)
            }
        }

        revalidatePath(`/dashboard/products/${productId}`)

        return {
            success: true,
            count: savedCompetitors.length,
            competitors: savedCompetitors,
            source: geminiResults.length > 0 ? 'gemini' : 'brave'
        }
    } catch (error: any) {
        console.error('[searchWebForCompetitors] Error:', error)
        return { success: false, error: error.message, count: 0 }
    }
}
