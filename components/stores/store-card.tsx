'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw } from "lucide-react"
import { useState, useTransition } from "react"
import { syncStore } from "@/app/actions/integrations"
import { useToast } from "@/hooks/use-toast"

interface StoreCardProps {
    store: {
        $id: string
        name: string
        platform: string
        lastSyncAt?: string
    }
    onDisconnect: (id: string) => void
}

export function StoreCard({ store, onDisconnect }: StoreCardProps) {
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const handleSync = () => {
        startTransition(async () => {
            const result = await syncStore(store.$id)
            if (result.success) {
                toast({
                    title: "Sync Complete",
                    description: `Successfully synced ${result.count} products.`,
                })
            } else {
                toast({
                    title: "Sync Failed",
                    description: result.error || "Failed to sync products.",
                    variant: "destructive",
                })
            }
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {store.name}
                </CardTitle>
                <Badge variant="default">
                    Connected
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground mb-4">
                    <div className="flex justify-between mb-1">
                        <span>Platform:</span>
                        <span className="capitalize">{store.platform}</span>
                    </div>
                    {store.lastSyncAt && (
                        <div className="flex justify-between">
                            <span>Last Sync:</span>
                            <span>{new Date(store.lastSyncAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleSync}
                        disabled={isPending}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                        {isPending ? 'Syncing...' : 'Sync Products'}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDisconnect(store.$id)}
                        disabled={isPending}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
