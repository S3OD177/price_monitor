import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite/server';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import { SallaClient } from '@/lib/salla/client';
import { ID, Query } from 'node-appwrite';

export const dynamic = 'force-dynamic'; // Ensure route is not cached

export async function GET(request: NextRequest) {
    // 1. Verify Authentication (CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { databases } = await createAdminClient();

        // 2. Fetch all connected stores (globally, not just for one user)
        // Note: In a real multi-tenant app, you might want to batch this
        const stores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES
        );

        const results = [];

        // 3. Iterate and sync each store
        for (const store of stores.documents) {
            if (store.accessToken && store.platform === 'salla') {
                try {
                    const salla = new SallaClient(store.accessToken);
                    const response = await salla.getProducts(1);
                    const products = response.data;

                    if (products && Array.isArray(products)) {
                        let storeSyncedCount = 0;

                        for (const item of products) {
                            // Check existing
                            const existing = await databases.listDocuments(
                                APPWRITE_CONFIG.DATABASE_ID,
                                APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
                                [
                                    Query.equal('externalId', String(item.id)),
                                    Query.equal('storeId', store.$id)
                                ]
                            );

                            const productData: any = {
                                userId: store.userId, // Use store owner's ID
                                user_id: store.userId,
                                storeId: store.$id,
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
                                is_available: !!item.is_available
                            };

                            if (item.urls?.customer) {
                                productData.url = item.urls.customer;
                            }

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
                            storeSyncedCount++;
                        }

                        // Update last sync time
                        await databases.updateDocument(
                            APPWRITE_CONFIG.DATABASE_ID,
                            APPWRITE_CONFIG.COLLECTIONS.STORES,
                            store.$id,
                            { lastSyncAt: new Date().toISOString() }
                        );

                        results.push({ storeId: store.$id, status: 'success', count: storeSyncedCount });
                    }
                } catch (error: any) {
                    console.error(`Failed to sync store ${store.$id}:`, error);
                    results.push({ storeId: store.$id, status: 'failed', error: error.message });
                }
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        console.error('Cron Job Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
