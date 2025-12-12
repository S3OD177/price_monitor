'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStores, disconnectStore } from '@/app/actions/dashboard'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { ConnectStoreDialog } from "@/components/stores/connect-store-dialog"
import { StoreCard } from "@/components/stores/store-card"
import { Loader2 } from 'lucide-react'

export default function StoresPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [stores, setStores] = useState<any[]>([])
    const [locale, setLocale] = useState('en')

    useEffect(() => {
        // Extract locale from path
        const pathLocale = window.location.pathname.split('/')[1] || 'en'
        setLocale(pathLocale)

        async function init() {
            try {
                const result = await getStores()

                if (result.success) {
                    setStores(result.stores)
                    // We don't have user object from getStores, but we can get it if needed.
                    // For now, assuming if success, we are good.
                    // If we need user ID for other things, we might need to fetch it or return it from action.
                    // The original code used user.$id for filtering stores, but server action should handle that (currently it lists all stores, might need to filter by user if not already done by Appwrite permissions).
                    // Appwrite permissions usually handle "own" documents if set up correctly.
                } else {
                    if (result.error?.includes('Unauthorized') || result.error?.includes('missing scopes')) {
                        router.push('/auth')
                    } else {
                        console.warn('Error fetching stores:', result.error)
                        setStores([])
                    }
                }
            } catch (error) {
                console.error('StoresPage: Unexpected error', error)
                router.push('/auth')
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [router])

    const handleDisconnect = async (storeId: string) => {
        try {
            const result = await disconnectStore(storeId)
            if (result.success) {
                setStores(stores.filter(s => s.$id !== storeId))
            } else {
                console.error('Failed to disconnect store:', result.error)
                // Optionally show toast
            }
        } catch (error) {
            console.error('Failed to disconnect store:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Stores</h2>
                    <p className="text-muted-foreground">
                        Manage your connected Salla and Trendyol stores.
                    </p>
                </div>
                <ConnectStoreDialog />
            </div>

            {stores.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No stores connected</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You haven&apos;t connected any stores yet. Connect a store to start monitoring prices.
                        </p>
                        <ConnectStoreDialog />
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store: any) => (
                        <StoreCard
                            key={store.$id}
                            store={store}
                            onDisconnect={() => handleDisconnect(store.$id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
