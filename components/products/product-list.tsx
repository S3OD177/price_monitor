'use client'

import { useState } from "react"
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { ProductCard } from "@/components/products/product-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Product } from "@/lib/data/appwrite"

interface ProductListProps {
    initialProducts: Product[]
}

export function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [searchQuery, setSearchQuery] = useState("")

    const handleAddProduct = (url: string) => {
        // In a real app, this would trigger a server action or API call
        // which would then update the list. For now, we rely on revalidation or page reload.
        const newProduct: Product = {
            $id: Math.random().toString(36).substr(2, 9),
            name: "New Monitored Product",
            sku: "NEW-ITEM-001",
            image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            price: 0.00,
            user_id: "current_user"
        }
        setProducts([newProduct, ...products])
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">
                        Monitor and manage your product catalog.
                    </p>
                </div>
                <AddProductDialog onAdd={handleAddProduct} />
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                        <h3 className="mt-4 text-lg font-semibold">No products found</h3>
                        <p className="mb-4 mt-2 text-sm text-muted-foreground">
                            Try adjusting your search or add a new product to monitor.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
