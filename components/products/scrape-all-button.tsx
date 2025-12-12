'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { scrapeAllCompetitors } from '@/app/[locale]/dashboard/products/[id]/actions'

interface ScrapeAllButtonProps {
    productId: string
}

export function ScrapeAllButton({ productId }: ScrapeAllButtonProps) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleScrapeAll = async () => {
        setLoading(true)
        try {
            const result = await scrapeAllCompetitors(productId)

            if (result.success) {
                toast({
                    title: "All Competitors Updated",
                    description: result.message || "Successfully refreshed all competitor data"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to refresh competitors",
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
        <Button
            variant="outline"
            size="sm"
            onClick={handleScrapeAll}
            disabled={loading}
        >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Scraping...' : 'Scrape All'}
        </Button>
    )
}
