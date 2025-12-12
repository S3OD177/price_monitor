'use server'

import { createSessionClient } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/lib/appwrite/config"
import { SallaClient } from "@/lib/salla/client"
import { ID, Query } from "node-appwrite"
import { revalidatePath } from "next/cache"

export async function syncSallaProducts() {
    try {
        const { databases, account } = await createSessionClient()
        const user = await account.get()

        // Find Salla store
        const stores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [
                Query.equal('userId', user.$id),
                Query.equal('platform', 'salla')
            ]
        )

        if (stores.total === 0) {
            return { success: false, error: "No Salla store connected" }
        }

        const store = stores.documents[0]
        if (!store.accessToken) {
            return { success: false, error: "Salla store has no access token" }
        }

        // Initialize Salla client
        const salla = new SallaClient(store.accessToken)

        // Fetch products from Salla
        // Note: Pagination is not handled here for simplicity, fetching first page
        const response = await salla.getProducts()
        const sallaProducts = response.data || []

        let addedCount = 0
        let updatedCount = 0

        for (const sp of sallaProducts) {
            // Check if product already exists by URL
            // Salla product URL is usually in sp.urls.customer
            const productUrl = sp.urls?.customer || sp.url
            if (!productUrl) continue

            const existingProducts = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                [
                    Query.equal('userId', user.$id),
                    Query.equal('url', productUrl)
                ]
            )

            const productData = {
                name: sp.name,
                url: productUrl,
                platform: 'salla',
                price: sp.price?.amount || sp.price || 0,
                currency: sp.price?.currency || 'SAR',
                stock: sp.quantity || 0,
                userId: user.$id,
                user_id: user.$id,
                status: sp.status || 'active',
                // Store the Salla ID if we want to link it later, maybe in a separate field or metadata
                // For now, we just map to our schema
            }

            if (existingProducts.total > 0) {
                // Update existing
                await databases.updateDocument(
                    APPWRITE_CONFIG.DATABASE_ID,
                    APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                    existingProducts.documents[0].$id,
                    productData
                )
                updatedCount++
            } else {
                // Create new
                await databases.createDocument(
                    APPWRITE_CONFIG.DATABASE_ID,
                    APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                    ID.unique(),
                    {
                        ...productData,
                        createdAt: new Date().toISOString()
                    }
                )
                addedCount++
            }
        }

        revalidatePath('/dashboard/products')
        return { success: true, added: addedCount, updated: updatedCount }

    } catch (error: any) {
        console.error('[syncSallaProducts] Error:', error)
        return { success: false, error: error.message }
    }
}
