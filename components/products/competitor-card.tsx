'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingDown, TrendingUp, RefreshCw, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { forceScrapeCompetitor } from '@/app/[locale]/dashboard/products/[id]/actions'
import { formatDistanceToNow, addHours } from 'date-fns'
import { ChangeRequestDialog } from './change-request-dialog'
import { VerifiedBadge } from '@/components/ui/verified-badge'

interface CompetitorCardProps {
    competitor: any
    productPrice: number
    productCurrency: string
}

export function CompetitorCard({ competitor, productPrice, productCurrency }: CompetitorCardProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const priceDiff = competitor.price - productPrice
    const isLower = priceDiff < 0
    const isHigher = priceDiff > 0

    const lastScraped = new Date(competitor.lastScraped)
    const nextScrape = addHours(lastScraped, 24)
    const isStale = new Date() > nextScrape

    const handleRefresh = async () => {
        setLoading(true)
        try {
            const result = await forceScrapeCompetitor(competitor.$id)

            if (result.success) {
                toast({
                    title: "Updated",
                    description: "Competitor data refreshed successfully"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to refresh data",
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
            {competitor.imageUrl && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border bg-muted">
                    <Image
                        src={competitor.imageUrl}
                        alt={competitor.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={competitor.name}>{competitor.name}</p>
                    {competitor.verified && <VerifiedBadge size={14} />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                        {competitor.platform}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground" title={`Next update: ${nextScrape.toLocaleString()}`}>
                        <Clock className="mr-1 h-3 w-3" />
                        {isStale ? (
                            <span className="text-orange-500 font-medium">Update due</span>
                        ) : (
                            <span>{formatDistanceToNow(nextScrape, { addSuffix: true })}</span>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
                <p className="text-sm font-bold">
                    {competitor.price} {competitor.currency}
                </p>
                {priceDiff !== 0 && (
                    <div className={`flex items-center gap-1 text-xs ${isLower ? 'text-green-600' : 'text-red-600'}`}>
                        {isLower ? (
                            <TrendingDown className="h-3 w-3" />
                        ) : (
                            <TrendingUp className="h-3 w-3" />
                        )}
                        {Math.abs(priceDiff).toFixed(2)} {competitor.currency}
                    </div>
                )}
                <div className="flex items-center gap-1 mt-1">
                    <ChangeRequestDialog competitor={competitor} />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleRefresh}
                        disabled={loading}
                        title="Scrape Now"
                    >
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
