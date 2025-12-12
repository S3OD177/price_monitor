'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Check } from 'lucide-react'
import { addCompetitorToProduct } from '@/app/[locale]/dashboard/products/[id]/actions'
import { useToast } from '@/hooks/use-toast'
import { VerifiedBadge } from '@/components/ui/verified-badge'

interface SuggestedCompetitorCardProps {
    competitor: any
    productId: string
    onAdded?: () => void
}

export function SuggestedCompetitorCard({ competitor, productId, onAdded }: SuggestedCompetitorCardProps) {
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const { toast } = useToast()

    const handleTrack = async () => {
        setLoading(true)
        try {
            const result = await addCompetitorToProduct(productId, competitor.url)

            if (result.success) {
                setAdded(true)
                toast({
                    title: "Competitor added",
                    description: "Successfully added competitor to your product."
                })
                onAdded?.()
            } else {
                toast({
                    title: "Error",
                    description: result.error || 'Failed to add competitor',
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
            {competitor.imageUrl ? (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-muted">
                    <Image
                        src={competitor.imageUrl}
                        alt={competitor.name}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="h-16 w-16 flex-shrink-0 rounded border bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No img</span>
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={competitor.name}>
                        {competitor.name}
                    </p>
                    {competitor.verified && <VerifiedBadge size={14} />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold">
                        {competitor.price} {competitor.currency}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 capitalize">
                        {competitor.platform}
                    </Badge>
                </div>
                {competitor.sku && (
                    <p className="text-xs text-muted-foreground mt-1">
                        SKU: {competitor.sku}
                    </p>
                )}
            </div>

            <Button
                size="sm"
                variant={added ? "secondary" : "default"}
                className="h-8 px-3"
                onClick={handleTrack}
                disabled={loading || added}
            >
                {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : added ? (
                    <>
                        <Check className="h-3 w-3 mr-1" />
                        Added
                    </>
                ) : (
                    <>
                        <Plus className="h-3 w-3 mr-1" />
                        Track
                    </>
                )}
            </Button>
        </div>
    )
}
