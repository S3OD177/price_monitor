'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Plus, AlertCircle, CheckCircle2, Clipboard, Search } from 'lucide-react'
import { scrapeCompetitorUrl, saveCompetitorProduct, addCompetitorToProduct } from '@/app/[locale]/dashboard/products/[id]/actions'
import Image from 'next/image'
import { SuggestedCompetitorCard } from './suggested-competitor-card'
import { useToast } from '@/hooks/use-toast'

interface AddCompetitorDialogProps {
    productId: string
    suggestedCompetitors?: any[]
    onAdded?: () => void
}

export function AddCompetitorDialog({ productId, suggestedCompetitors = [], onAdded }: AddCompetitorDialogProps) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [scrapedData, setScrapedData] = useState<any>(null)
    const [verifying, setVerifying] = useState(false)
    const [activeTab, setActiveTab] = useState('manual')
    const { toast } = useToast()

    // Set initial tab based on suggestions availability
    useEffect(() => {
        if (open && suggestedCompetitors.length > 0) {
            setActiveTab('suggested')
        } else if (open) {
            setActiveTab('manual')
        }
    }, [open, suggestedCompetitors.length])

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            if (text) setUrl(text)
        } catch (err) {
            console.error('Failed to read clipboard', err)
            toast({
                title: "Error",
                description: "Failed to read clipboard",
                variant: "destructive"
            })
        }
    }

    const handleScrape = async () => {
        if (!url) {
            setError('Please enter a URL')
            return
        }

        setLoading(true)
        setError('')
        setScrapedData(null)

        const result = await scrapeCompetitorUrl(url)

        setLoading(false)

        if (!result.success) {
            setError(result.error || 'Failed to scrape URL')
            return
        }

        // Show scraped data for verification
        setScrapedData(result.data)
    }

    const handleVerifyAndSave = async () => {
        if (!scrapedData) return

        setVerifying(true)
        setError('')

        // Save to shared database
        const saveResult = await saveCompetitorProduct(scrapedData)

        if (!saveResult.success) {
            setError(saveResult.error || 'Failed to save competitor')
            setVerifying(false)
            return
        }

        // Add to user's product tracking
        const addResult = await addCompetitorToProduct(productId, scrapedData.url)

        setVerifying(false)

        if (!addResult.success) {
            setError(addResult.error || 'Failed to add competitor to product')
            return
        }

        // Success
        toast({
            title: "Success",
            description: "Competitor added successfully"
        })
        setOpen(false)
        setUrl('')
        setScrapedData(null)
        setError('')
        onAdded?.()
    }

    const handleCancel = () => {
        setScrapedData(null)
        setError('')
    }

    const handleSuggestionAdded = () => {
        onAdded?.()
        // We don't close the dialog immediately so user can add more suggestions if they want
        // But if they want to close, they can click outside or close button
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Competitor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Competitor</DialogTitle>
                    <DialogDescription>
                        Track competitor prices from supported Saudi Arabia stores.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {suggestedCompetitors.length > 0 && (
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="suggested">Suggestions ({suggestedCompetitors.length})</TabsTrigger>
                            <TabsTrigger value="manual">Manual URL</TabsTrigger>
                        </TabsList>
                    )}

                    <TabsContent value="suggested" className="space-y-4">
                        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                            {suggestedCompetitors.map((competitor) => (
                                <SuggestedCompetitorCard
                                    key={competitor.$id}
                                    competitor={competitor}
                                    productId={productId}
                                    onAdded={handleSuggestionAdded}
                                />
                            ))}
                        </div>
                        <div className="text-center text-xs text-muted-foreground pt-2">
                            Can't find what you're looking for? <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setActiveTab('manual')}>Add manually</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="manual">
                        {!scrapedData ? (
                            <div className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label htmlFor="url">Product URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="url"
                                            placeholder="https://salla.sa/store/product-url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            disabled={loading}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" size="icon" onClick={handlePaste} title="Paste from clipboard">
                                            <Clipboard className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Supported: Salla, Trendyol, and other Saudi stores.
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button onClick={handleScrape} disabled={loading || !url} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Scraping Product...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Scrape & Verify
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 py-2">
                                <Alert className="bg-green-50/50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-700">
                                        Product found! Please verify the details below.
                                    </AlertDescription>
                                </Alert>

                                <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                                    <div className="flex gap-4">
                                        {scrapedData.imageUrl && (
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-white">
                                                <Image
                                                    src={scrapedData.imageUrl}
                                                    alt={scrapedData.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-semibold line-clamp-2">{scrapedData.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-primary">
                                                    {scrapedData.price} {scrapedData.currency}
                                                </span>
                                                {scrapedData.originalPrice && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {scrapedData.originalPrice} {scrapedData.currency}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 pt-1">
                                                <Badge variant="secondary" className="capitalize">
                                                    {scrapedData.platform}
                                                </Badge>
                                                {scrapedData.sku && (
                                                    <Badge variant="outline" className="font-mono">
                                                        {scrapedData.sku}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="ghost" onClick={handleCancel} disabled={verifying}>
                                        Back to Search
                                    </Button>
                                    <Button onClick={handleVerifyAndSave} disabled={verifying}>
                                        {verifying ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Confirm & Track'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
