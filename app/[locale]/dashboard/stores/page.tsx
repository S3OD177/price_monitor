'use client'

import { useState } from "react"
import { ConnectStoreDialog } from "@/components/stores/connect-store-dialog"
import { StoreCard } from "@/components/stores/store-card"

export default function StoresPage() {
    const [stores, setStores] = useState<any[]>([])

    const handleConnect = (store: any) => {
        setStores([...stores, store])
    }

    const handleDisconnect = (id: string) => {
        setStores(stores.filter((s) => s.id !== id))
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Stores</h2>
                    <p className="text-muted-foreground">
                        Manage your connected Salla and Trendyol stores.
                    </p>
                </div>
                <ConnectStoreDialog onConnect={handleConnect} />
            </div>

            {stores.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No stores connected</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            You haven&apos;t connected any stores yet. Connect a store to start monitoring prices.
                        </p>
                        <ConnectStoreDialog onConnect={handleConnect} />
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stores.map((store) => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            onDisconnect={handleDisconnect}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
