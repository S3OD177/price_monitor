
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Loader2, Globe } from 'lucide-react'
import { findCompetitorsBySKU, searchWebForCompetitors } from '@/app/[locale]/dashboard/products/[id]/actions'
import { useToast } from '@/hooks/use-toast'

interface SearchCompetitorsButtonProps {
    productId: string
    sku: string | null
}

export function SearchCompetitorsButton({ productId, sku }: SearchCompetitorsButtonProps) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'searching'>('idle')
    const { toast } = useToast()

    const handleSearch = async () => {
        if (!sku) {
            toast({
                title: "No SKU",
                description: "This product doesn't have a SKU to search with",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        setStatus('searching')

        try {
            // Step 1: Search Database
            const dbResult = await findCompetitorsBySKU(sku)

            if (dbResult.success && dbResult.competitors && dbResult.competitors.length > 0) {
                const count = dbResult.competitors.length
                toast({
                    title: "Search Complete",
                    description: `Found ${count} competitor${count !== 1 ? 's' : ''} for this product.`,
                    variant: "default"
                })
                window.location.reload()
                return
            }

            // Step 2: Search Web (if no DB results)
            const webResult = await searchWebForCompetitors(sku, productId)

            if (webResult.success && webResult.count > 0) {
                toast({
                    title: "Search Complete",
                    description: `Found ${webResult.count} new competitor${webResult.count !== 1 ? 's' : ''}.`,
                    variant: "default"
                })
                window.location.reload()
            } else {
                toast({
                    title: "No Results Found",
                    description: "Could not find any competitors for this product.",
                    variant: "destructive"
                })
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred during search.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
            setStatus('idle')
        }
    }

    if (!sku) {
        return null
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            disabled={loading}
            className="min-w-[140px]"
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Search className="mr-2 h-4 w-4" />
            )}
            {status === 'searching' ? 'Searching...' : 'Find Competitors'}
        </Button>
    )
}
