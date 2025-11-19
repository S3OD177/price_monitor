import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MoreHorizontal, Plus } from "lucide-react"
import { Product } from "@/lib/data/appwrite"
import Image from "next/image"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const competitors: any[] = [] // TODO: Fetch competitors

    return (
        <Card className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-lg line-clamp-1" title={product.name}>
                            {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{product.sku || 'No SKU'}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold">${(product.price || 0).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">Your Price</span>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Competitors
                    </h4>
                    {competitors.length > 0 ? (
                        <div className="space-y-2">
                            {competitors.map((competitor) => {
                                const priceDiff = competitor.price - (product.price || 0)
                                const isCheaper = priceDiff < 0
                                const diffPercent = (Math.abs(priceDiff) / (product.price || 1)) * 100

                                return (
                                    <div key={competitor.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{competitor.name}</span>
                                            <a href={competitor.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>${competitor.price.toFixed(2)}</span>
                                            <Badge variant={isCheaper ? "destructive" : "default"} className="h-5 px-1.5 text-[10px]">
                                                {isCheaper ? "-" : "+"}{diffPercent.toFixed(0)}%
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No competitors tracked</p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 bg-muted/50">
                <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Add Competitor
                </Button>
            </CardFooter>
        </Card>
    )
}
