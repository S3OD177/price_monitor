'use server'

import { redirect } from 'next/navigation'
import { getSallaAuthUrl, SallaClient } from '@/lib/salla/client'
import { createSessionClient } from '@/lib/appwrite/server'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { ID, Query } from 'node-appwrite'
import { TrendyolClient } from '@/lib/trendyol/client'

export async function connectSalla() {
    const state = ID.unique(); // Should ideally store this to verify on callback
    const url = getSallaAuthUrl(state);
    redirect(url);
}

export async function connectTrendyol(formData: FormData) {
    const supplierId = formData.get('supplierId') as string;
    const apiKey = formData.get('apiKey') as string;
    const apiSecret = formData.get('apiSecret') as string;

    if (!supplierId || !apiKey || !apiSecret) {
        return { success: false, error: "Missing credentials" };
    }

    const client = new TrendyolClient({ supplierId, apiKey, apiSecret });
    const isValid = await client.validateCredentials();

    if (!isValid) {
        return { success: false, error: "Invalid credentials or API access" };
    }

    const { databases, account } = await createSessionClient();
    const user = await account.get();

    try {
        // Check if store exists
        const existingStores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [
                Query.equal('userId', user.$id),
                Query.equal('platform', 'trendyol'),
                Query.equal('externalStoreId', supplierId)
            ]
        );

        const storeData = {
            userId: user.$id,
            platform: 'trendyol',
            name: `Trendyol Store (${supplierId})`,
            externalStoreId: supplierId,
            supplierId,
            apiKey,
            apiPassword: apiSecret, // Mapping apiSecret to apiPassword field in DB
        };

        if (existingStores.total > 0) {
            await databases.updateDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.STORES,
                existingStores.documents[0].$id,
                storeData
            );
        } else {
            await databases.createDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.STORES,
                ID.unique(),
                storeData
            );
        }

        return { success: true };
    } catch (error: any) {
        console.error("Connect Trendyol Error:", error);
        return { success: false, error: error.message };
    }
}

export async function syncStore(storeId: string) {
    const { databases } = await createSessionClient();

    try {
        // 1. Get Store credentials
        const store = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            storeId
        );

        if (store.platform === 'salla') {
            if (!store.accessToken) throw new Error("No access token for Salla store");

            const salla = new SallaClient(store.accessToken);
            const productsResponse = await salla.getProducts();
            const products = productsResponse.data;

            let count = 0;
            for (const item of products) {
                await upsertProduct(databases, store, item, 'salla');
                count++;
            }
            return { success: true, count };
        } else if (store.platform === 'trendyol') {
            if (!store.supplierId || !store.apiKey || !store.apiPassword) {
                throw new Error("Missing credentials for Trendyol store");
            }

            const trendyol = new TrendyolClient({
                supplierId: store.supplierId,
                apiKey: store.apiKey,
                apiSecret: store.apiPassword // Mapped from DB field
            });

            const productsResponse = await trendyol.getProducts();
            const products = productsResponse.content || []; // Trendyol returns { content: [...] }

            let count = 0;
            for (const item of products) {
                await upsertProduct(databases, store, item, 'trendyol');
                count++;
            }
            return { success: true, count };
        }

        return { success: false, error: "Unsupported platform" };
    } catch (error: any) {
        console.error("Sync error:", error);
        return { success: false, error: error.message };
    }
}

async function upsertProduct(databases: any, store: any, item: any, platform: 'salla' | 'trendyol') {
    let externalId, name, sku, price, stock, imageUrl;

    if (platform === 'salla') {
        externalId = String(item.id);
        name = item.name;
        sku = item.sku || '';
        price = parseFloat(item.price.amount || item.price);
        stock = item.quantity || 0;
        imageUrl = item.images?.[0]?.url || '';
    } else { // trendyol
        externalId = item.productContentId || item.id; // Use appropriate ID
        name = item.title;
        sku = item.barcode || item.productMainId;
        price = item.salePrice || item.listPrice;
        stock = item.stockUnitQuantity || 0;
        imageUrl = item.images?.[0]?.url || '';
    }

    const existing = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
        [
            Query.equal('storeId', store.$id),
            Query.equal('externalProductId', String(externalId))
        ]
    );

    const productData = {
        userId: store.userId,
        storeId: store.$id,
        platform,
        externalProductId: String(externalId),
        name,
        sku,
        price,
        currency: 'SAR', // Default or fetch from API if available
        stock,
        imageUrl,
        status: 'active',
    };

    if (existing.total > 0) {
        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            existing.documents[0].$id,
            productData
        );
    } else {
        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            ID.unique(),
            productData
        );
    }
}
