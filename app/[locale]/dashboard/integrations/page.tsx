import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { IntegrationCard } from '@/components/integrations/integration-card'
import { Store } from 'lucide-react'
import { Query } from 'node-appwrite'
import { getSallaAuthUrl } from '@/lib/salla/client'
import { redirect } from 'next/navigation'
import { syncAllStores } from '@/app/actions/integrations'
import { disconnectStore } from '@/app/actions/dashboard'
import { revalidatePath } from 'next/cache'
import { SyncAllButton } from '@/components/integrations/sync-all-button'

export default async function IntegrationsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const { account } = await createSessionClient()
    const { databases } = await createAdminClient()

    let user
    try {
        user = await account.get()
    } catch (error) {
        redirect(`/${locale}/auth`)
    }

    let stores: any[] = []
    try {
        const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.STORES,
            [Query.equal('userId', user.$id)]
        )
        stores = response.documents
    } catch (error) {
        console.warn('Error fetching stores:', error)
    }

    const sallaStore = stores.find((store: any) => store.platform === 'salla')
    const trendyolStore = stores.find((store: any) => store.platform === 'trendyol')

    const sallaConnected = !!sallaStore
    const trendyolConnected = !!trendyolStore

    // Generate Salla OAuth URL with user ID as state for security
    // This now runs on the server, so process.env.SALLA_CLIENT_ID is available
    const sallaAuthUrl = getSallaAuthUrl(user.$id)

    async function handleDisconnect(storeId: string) {
        'use server'
        await disconnectStore(storeId)
        revalidatePath('/dashboard/integrations')
    }

    return (
        <div className="flex-1 space-y-8 p-8">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
                        <p className="text-muted-foreground">
                            Connect your e-commerce platforms to start monitoring prices.
                        </p>
                    </div>
                    {(sallaConnected || trendyolConnected) && (
                        <form action={async () => {
                            'use server'
                            await syncAllStores()
                        }}>
                            <SyncAllButton />
                        </form>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <IntegrationCard
                    name="Salla"
                    description="Connect your Salla store to import products and track competitor prices."
                    logo={<Store className="h-6 w-6 text-green-600" />}
                    isConnected={sallaConnected}
                    connectUrl={sallaAuthUrl}
                    manageUrl="/dashboard/stores"
                    storeId={sallaStore?.$id}
                    onDisconnect={sallaConnected ? async () => {
                        'use server'
                        await handleDisconnect(sallaStore.$id)
                    } : undefined}
                />
                <IntegrationCard
                    name="Trendyol"
                    description="Connect your Trendyol store to import products and monitor market prices."
                    logo={<Store className="h-6 w-6 text-orange-600" />}
                    isConnected={trendyolConnected}
                    connectUrl="/dashboard/integrations/trendyol"
                    manageUrl="/dashboard/stores"
                    storeId={trendyolStore?.$id}
                    onDisconnect={trendyolConnected ? async () => {
                        'use server'
                        await handleDisconnect(trendyolStore.$id)
                    } : undefined}
                />
            </div>
        </div>
    )
}
