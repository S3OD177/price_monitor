import { NextRequest, NextResponse } from 'next/server';
import { exchangeSallaCode, SallaClient } from '@/lib/salla/client';
import { createAdminClient } from '@/lib/appwrite/server';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import { ID, Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This contains the userId
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/dashboard/integrations?error=${error}`, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/dashboard/integrations?error=no_code', request.url));
    }

    if (!state) {
        return NextResponse.redirect(new URL('/dashboard/integrations?error=no_state', request.url));
    }

    try {
        // 1. Exchange code for token
        const tokenData = await exchangeSallaCode(code);

        // 2. Get Merchant Info
        const salla = new SallaClient(tokenData.access_token);
        const userInfo = await salla.getMerchantInfo();
        const merchant = userInfo.data.merchant;

        // 3. Save to Appwrite using Admin Client (state contains userId)
        const { databases } = await createAdminClient();
        const userId = state; // The state parameter contains the user ID

        // Check if store exists
        const existingStores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [
                Query.equal('userId', userId),
                Query.equal('platform', 'salla'),
                Query.equal('externalStoreId', String(merchant.id))
            ]
        );

        const storeData = {
            userId: userId,
            platform: 'salla',
            name: merchant.name || merchant.username,
            externalStoreId: String(merchant.id),
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
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

        return NextResponse.redirect(new URL('/dashboard/integrations?success=salla_connected', request.url));

    } catch (err: any) {
        console.error("Salla Callback Error:", err);
        return NextResponse.redirect(new URL(`/dashboard/integrations?error=${encodeURIComponent(err.message)}`, request.url));
    }
}
