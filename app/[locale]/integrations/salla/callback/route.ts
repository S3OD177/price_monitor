import { createSessionClient } from '@/lib/appwrite/server'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { SallaClient, exchangeSallaCode } from '@/lib/salla/client'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { ID, Query } from 'node-appwrite'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
        return redirect('/dashboard?error=No code provided')
    }

    const { databases, account } = await createSessionClient()

    let user;
    try {
        user = await account.get()
    } catch (error) {
        return redirect('/auth')
    }

    try {
        const tokenData = await exchangeSallaCode(code)
        const salla = new SallaClient(tokenData.access_token)
        const merchantInfo = await salla.getMerchantInfo()

        // Check if store exists
        const existingStores = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [
                Query.equal('userId', user.$id),
                Query.equal('platform', 'salla'),
                Query.equal('externalStoreId', String(merchantInfo.data.id))
            ]
        );

        const storeData = {
            userId: user.$id,
            platform: 'salla',
            name: merchantInfo.data.name || 'Salla Store',
            externalStoreId: String(merchantInfo.data.id),
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

        // Trigger initial sync (optional, or let user click sync)
        // await syncStore(...) 

    } catch (error: any) {
        console.error("Salla Callback Error:", error);
        return redirect('/dashboard?error=' + encodeURIComponent(error.message))
    }

    return redirect('/dashboard')
}
