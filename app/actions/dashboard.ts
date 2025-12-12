'use server'

import { createSessionClient, createAdminClient } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/lib/appwrite/config"
import { Query } from "node-appwrite"

export async function getDashboardStats() {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()

        // Verify session and get user ID
        const user = await account.get()

        const [storesResponse, productsResponse] = await Promise.all([
            databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.STORES,
                [Query.equal('userId', user.$id)]
            ),
            databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                [Query.equal('userId', user.$id)] // Assuming products also have userId or linked via store
            )
        ])

        return {
            success: true,
            stores: storesResponse.documents,
            products: productsResponse.documents
        }
    } catch (error: any) {
        console.error('[getDashboardStats] Failed to fetch dashboard data:', error)
        return {
            success: false,
            error: error.message,
            stores: [],
            products: []
        }
    }
}

export async function getStores() {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()

        // Verify session
        const user = await account.get()

        const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [Query.equal('userId', user.$id)]
        )

        return { success: true, stores: response.documents }
    } catch (error: any) {
        console.error('[getStores] Failed to fetch stores:', error)
        return { success: false, error: error.message, stores: [] }
    }
}

export async function disconnectStore(storeId: string) {
    try {
        const { account } = await createSessionClient()
        const { databases } = await createAdminClient()

        // Verify session
        const user = await account.get()

        // Verify ownership before deleting
        const store = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId
        )

        if (store.userId !== user.$id) {
            throw new Error('Unauthorized')
        }

        await databases.deleteDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId
        )

        return { success: true }
    } catch (error: any) {
        console.error('[disconnectStore] Failed to disconnect store:', error)
        return { success: false, error: error.message }
    }
}
