'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getSallaProducts, syncStore } from '@/app/actions/integrations'
import { Loader2, Search, Package } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Product {
    id: string
    name: string
    price: number
    currency: string
    imageUrl: string
    sku: string
    stock: number
}

interface ProductSelectionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    storeId: string
    storeName: string
}

export function ProductSelectionDialog({ open, onOpenChange, storeId, storeName }: ProductSelectionDialogProps) {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            loadProducts()
        }
    }, [open])

    const loadProducts = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await getSallaProducts(storeId)
            if (result.success) {
                setProducts(result.products)
            } else {
                setError(result.error || 'Failed to load products')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleSelectProduct = (productId: string, checked: boolean) => {
        const newSelected = new Set(selectedIds)
        if (checked) {
            newSelected.add(productId)
        } else {
            newSelected.delete(productId)
        }
        setSelectedIds(newSelected)
    }

    const handleSync = async () => {
        if (selectedIds.size === 0) return

        setIsSyncing(true)
        try {
            const result = await syncStore(storeId, Array.from(selectedIds))
            if (result.success) {
                onOpenChange(false)
                router.refresh()
            } else {
                setError(result.error || 'Failed to sync products')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSyncing(false)
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Select Products to Sync</DialogTitle>
                    <DialogDescription>
                        Choose which products from {storeName} you want to import
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Select All */}
                    {!isLoading && filteredProducts.length > 0 && (
                        <div className="flex items-center space-x-2 border-b pb-2">
                            <Checkbox
                                id="select-all"
                                checked={filteredProducts.every(p => selectedIds.has(p.id))}
                                onCheckedChange={handleSelectAll}
                            />
                            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                Select All ({selectedIds.size} selected)
                            </label>
                        </div>
                    )}

                    {/* Products List */}
                    <ScrollArea className="h-[400px] pr-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-destructive">
                                <p>{error}</p>
                                <Button variant="outline" onClick={loadProducts} className="mt-4">
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No products found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <Checkbox
                                            id={`product-${product.id}`}
                                            checked={selectedIds.has(product.id)}
                                            onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                                        />
                                        {product.imageUrl && (
                                            <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <label
                                                htmlFor={`product-${product.id}`}
                                                className="font-medium text-sm cursor-pointer block truncate"
                                            >
                                                {product.name}
                                            </label>
                                            <p className="text-xs text-muted-foreground">
                                                SKU: {product.sku || 'N/A'} • Stock: {product.stock}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-semibold text-sm">
                                                {product.price} {product.currency}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSyncing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={selectedIds.size === 0 || isSyncing}
                    >
                        {isSyncing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            `Sync ${selectedIds.size} Product${selectedIds.size !== 1 ? 's' : ''}`
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
