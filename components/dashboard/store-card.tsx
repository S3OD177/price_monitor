'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, RefreshCw } from "lucide-react"
import { syncStore } from "@/app/actions/integrations"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface StoreCardProps {
    store: any // Type this properly if possible
}

export function StoreCard({ store }: StoreCardProps) {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            await syncStore(store.$id)
            router.refresh()
        } catch (error) {
            console.error("Sync failed", error)
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl ${store.platform === 'salla' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                    <Store className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-sm font-medium leading-none">{store.name}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">{store.platform}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="h-8"
            >
                <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
        </div>
    )
}
