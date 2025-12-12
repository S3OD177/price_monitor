import { createSessionClient, createAdminClient } from '@/lib/appwrite/server'
import { APPWRITE_CONFIG } from '@/lib/appwrite/config'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AddCompetitorDialog } from '@/components/products/add-competitor-dialog'
import { EditProductDialog } from '@/components/products/edit-product-dialog'
import { DeleteProductButton } from '@/components/products/delete-product-button'
import { SearchCompetitorsButton } from '@/components/products/search-competitors-button'
import { getCompetitorPrices, findCompetitorsBySKU } from './actions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SuggestedCompetitorCard } from '@/components/products/suggested-competitor-card'
import { CompetitorCard } from '@/components/products/competitor-card'
import { ScrapeAllButton } from '@/components/products/scrape-all-button'

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params
    const { account } = await createSessionClient()
    const { databases } = await createAdminClient()

    let user
    try {
        user = await account.get()
    } catch (error) {
        redirect(`/${locale}/auth`)
    }

    // Fetch product
    let product: any
    try {
        product = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.PRODUCTS,
            id
        )

        // Verify ownership
        if (product.userId !== user.$id && product.user_id !== user.$id) {
            notFound()
        }
    } catch (error) {
        console.error('Error fetching product:', error)
        notFound()
    }

    // Fetch competitor prices
    const competitorResult = await getCompetitorPrices(id)
    const competitors = competitorResult.success ? competitorResult.competitors : []

    // Find auto-matched competitors by SKU
    const autoMatchResult = product.sku ? await findCompetitorsBySKU(product.sku) : { success: true, competitors: [] }
    const autoMatchedBySku = autoMatchResult.success ? autoMatchResult.competitors : []

    // Fetch suggested competitors from stored URLs (populated by sync)
    let autoMatchedByUrl: any[] = []
    if (product.suggestedCompetitorUrls && product.suggestedCompetitorUrls.length > 0) {
        const { getCompetitorsByUrls } = await import('./actions')
        const urlMatchResult = await getCompetitorsByUrls(product.suggestedCompetitorUrls)
        if (urlMatchResult.success) {
            autoMatchedByUrl = urlMatchResult.competitors || []
        }
    }

    // Merge and deduplicate suggestions
    const allSuggestions = [...autoMatchedBySku, ...autoMatchedByUrl]
    const uniqueSuggestionsMap = new Map()
    allSuggestions.forEach((item: any) => {
        uniqueSuggestionsMap.set(item.url, item)
    })
    const uniqueSuggestions = Array.from(uniqueSuggestionsMap.values())

    // Filter out already tracked competitors
    const trackedUrls = competitors.map((c: any) => c.url)
    const suggestedCompetitors = uniqueSuggestions.filter((c: any) => !trackedUrls.includes(c.url))

    return (
        <div className="flex-1 space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                    <p className="text-muted-foreground">
                        Product details and competitor tracking
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <EditProductDialog product={product} />
                    <DeleteProductButton
                        productId={id}
                        productName={product.name}
                        redirectAfterDelete={true}
                        locale={locale}
                    />
                    <Link href={`/${locale}/dashboard/products`}>
                        <Button variant="outline">Back to Products</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Product Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>Basic product details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {product.imageUrl && (
                            <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-muted">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Platform</span>
                                <Badge variant="secondary" className="capitalize">
                                    {product.platform}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Your Price</span>
                                <span className="text-lg font-bold">
                                    {product.price} {product.currency}
                                </span>
                            </div>

                            {product.sku && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">SKU</span>
                                    <span className="font-mono text-sm">{product.sku}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Stock</span>
                                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status</span>
                                <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                                    {product.status}
                                </Badge>
                            </div>

                            {product.description && (
                                <div className="pt-4 border-t">
                                    <span className="text-sm font-medium">Description</span>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {product.url && (
                            <Link href={product.url} target="_blank" className="block">
                                <Button variant="outline" className="w-full">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Original Product
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>

                {/* Competitor Prices Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Competitor Prices</CardTitle>
                                <CardDescription>
                                    Track competitor pricing in Saudi Arabia
                                    {competitors.length > 0 && (
                                        <span className="text-xs ml-2">• Auto-scrape: Every 24 hours</span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <SearchCompetitorsButton productId={id} sku={product.sku} />
                                {competitors.length > 0 && <ScrapeAllButton productId={id} />}
                                <AddCompetitorDialog productId={id} suggestedCompetitors={suggestedCompetitors} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {competitors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No competitors tracked yet
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Add competitor URLs to start tracking prices
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {competitors.map((competitor: any) => (
                                    <CompetitorCard
                                        key={competitor.$id}
                                        competitor={competitor}
                                        productPrice={product.price}
                                        productCurrency={product.currency}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div >

            {/* Auto-matched Competitors */}
            {
                suggestedCompetitors.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Suggested Competitors</CardTitle>
                            <CardDescription>
                                Products with matching SKU found in our database
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    These products have the same SKU ({product.sku}) and are from Saudi Arabia stores.
                                </AlertDescription>
                            </Alert>
                            <div className="grid gap-3 md:grid-cols-2">
                                {suggestedCompetitors.slice(0, 4).map((competitor: any) => (
                                    <SuggestedCompetitorCard
                                        key={competitor.$id}
                                        competitor={competitor}
                                        productId={id}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    )
}
