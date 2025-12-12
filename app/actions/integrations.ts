'use server'

import { createSessionClient, createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_CONFIG } from "@/lib/appwrite/config";
import { SallaClient } from "@/lib/salla/client";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

export async function getSallaProducts(storeId: string) {
    const { account } = await createSessionClient();
    const { databases } = await createAdminClient();

    try {
        // Verify user session
        const user = await account.get();

        // Get store credentials and verify ownership
        const store = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId
        );

        if (store.userId !== user.$id) {
            throw new Error("Unauthorized: You don't own this store");
        }

        if (!store.accessToken) {
            throw new Error("Store not connected or missing access token");
        }

        // Initialize Salla Client
        const salla = new SallaClient(store.accessToken);

        // Fetch products from Salla
        const response = await salla.getProducts(1);
        const products = response.data;

        if (!products || !Array.isArray(products)) {
            throw new Error("Failed to fetch products from Salla");
        }

        // Return simplified product data for selection
        return {
            success: true,
            products: products.map((item: any) => ({
                id: String(item.id),
                name: item.name,
                price: item.price?.amount || 0,
                currency: item.price?.currency || 'SAR',
                imageUrl: item.images?.[0]?.url || '',
                sku: item.sku || '',
                stock: item.quantity || 0
            }))
        };

    } catch (error: any) {
        console.error("Get Salla Products Error:", error);
        return { success: false, error: error.message, products: [] };
    }
}

export async function syncStore(storeId: string, productIds?: string[]) {
    const { account } = await createSessionClient();
    const { databases } = await createAdminClient();

    try {
        // Verify user session
        const user = await account.get();

        // 1. Get store credentials and verify ownership
        const store = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId
        );

        if (store.userId !== user.$id) {
            throw new Error("Unauthorized: You don't own this store");
        }

        if (!store.accessToken) {
            throw new Error("Store not connected or missing access token");
        }

        // 2. Initialize Salla Client
        const salla = new SallaClient(store.accessToken);

        // 3. Fetch products (fetching first page for MVP)
        const response = await salla.getProducts(1);
        const products = response.data;

        if (!products || !Array.isArray(products)) {
            throw new Error("Failed to fetch products from Salla");
        }

        // Filter products if specific IDs provided
        const productsToSync = productIds
            ? products.filter((item: any) => productIds.includes(String(item.id)))
            : products;

        // 4. Sync to Appwrite
        let syncedCount = 0;
        for (const item of productsToSync) {
            // Check if product already exists
            const existing = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                [
                    Query.equal('externalId', String(item.id)),
                    Query.equal('storeId', storeId)
                ]
            );

            const productData: any = {
                userId: user.$id,
                user_id: user.$id,
                storeId: storeId,
                externalId: String(item.id),
                name: item.name,
                price: item.sale_price?.amount || item.price?.amount || 0,
                currency: item.price?.currency || 'SAR',
                stock: item.quantity || 0,
                sku: item.sku || '',
                platform: 'salla',
                imageUrl: item.images?.[0]?.url || item.thumbnail || '',
                description: item.description || '',
                regular_price: item.regular_price?.amount || 0,
                cost_price: item.cost_price?.amount || 0,
                taxed_price: item.taxed_price?.amount || 0,
                pre_tax_price: item.pre_tax_price?.amount || 0,
                sale_end: item.sale_end || '',
                is_available: !!item.is_available,
                suggestedCompetitorUrls: []
            };

            // Auto-match competitors by SKU if available
            if (item.sku) {
                try {
                    const { findCompetitorsBySKU } = await import('@/app/[locale]/dashboard/products/[id]/actions');
                    const matchResult = await findCompetitorsBySKU(item.sku);
                    if (matchResult.success && matchResult.competitors && matchResult.competitors.length > 0) {
                        // Add found competitor URLs to suggestions
                        productData.suggestedCompetitorUrls = matchResult.competitors.map((comp: any) => comp.url);
                    }
                } catch (err) {
                    console.warn(`Failed to auto-match competitors for SKU ${item.sku}:`, err);
                }
            }

            // Only add URL if it exists and is valid
            if (item.urls?.customer) {
                productData.url = item.urls.customer;
            }

            if (existing.total > 0) {
                // Update existing
                await databases.updateDocument(
                    APPWRITE_CONFIG.DATABASE_ID,
                    APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                    existing.documents[0].$id,
                    productData
                );
            } else {
                // Create new
                await databases.createDocument(
                    APPWRITE_CONFIG.DATABASE_ID,
                    APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                    ID.unique(),
                    productData
                );
            }
            syncedCount++;
        }

        // 5. Update store last sync time
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId,
            {
                lastSyncAt: new Date().toISOString()
            }
        );

        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/stores');

        return { success: true, count: syncedCount };

    } catch (error: any) {
        console.error("Sync Error:", error);
        return { success: false, error: error.message };
    }
}

export async function syncAllStores() {
    const { account } = await createSessionClient();
    const { databases } = await createAdminClient();

    try {
        // Verify user session
        const user = await account.get();

        // Get all connected stores for the user
        const stores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [Query.equal('userId', user.$id)]
        );

        let totalSynced = 0;
        const results = [];

        for (const store of stores.documents) {
            if (store.accessToken) {
                try {
                    // Reuse syncStore logic for each store
                    // We don't pass productIds to sync ALL products
                    const result = await syncStore(store.$id);
                    if (result.success && result.count) {
                        totalSynced += result.count;
                        results.push({ store: store.name, status: 'success', count: result.count });
                    } else {
                        results.push({ store: store.name, status: 'failed', error: result.error });
                    }
                } catch (err: any) {
                    results.push({ store: store.name, status: 'failed', error: err.message });
                }
            }
        }

        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/stores');
        revalidatePath('/dashboard/integrations');

        return { success: true, totalSynced, results };

    } catch (error: any) {
        console.error("Sync All Error:", error);
        return { success: false, error: error.message };
    }
}
