'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { ProductsTable } from "@/components/products/products-table"
import { ProductsToolbar } from "@/components/products/products-toolbar"
import { Loader2 } from 'lucide-react'
import { AddProductDialog } from "@/components/products/add-product-dialog"
import { addProduct, getProducts } from "./actions"

export default function ProductsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()
    const locale = params.locale as string || 'en'
    const query = searchParams.get('q')

    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        async function init() {
            try {
                setIsLoading(true)
                const result = await getProducts(query || undefined)

                if (result.success) {
                    setProducts(result.products)
                } else {
                    // If unauthorized, redirect to auth
                    if (result.error?.includes('Unauthorized') || result.error?.includes('missing scopes')) {
                        router.push('/auth')
                    } else {
                        console.error('[ProductsPage] Error fetching products:', result.error)
                    }
                }
            } catch (error) {
                console.error('[ProductsPage] Unexpected error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [router, query])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-8">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage and monitor your product catalog.</p>
                </div>
                <AddProductDialog onAdd={async (url) => {
                    const result = await addProduct(url)
                    if (result.success) {
                        // Refresh logic here - since we're using client-side fetch in useEffect, 
                        // we might need to trigger a re-fetch or just reload for now.
                        // Ideally, we'd use a better state management or SWR/TanStack Query.
                        window.location.reload()
                    } else {
                        // Handle error (e.g. show toast)
                        console.error(result.error)
                        alert("Failed to add product: " + result.error)
                    }
                }} />
            </div>

            <div className="space-y-4">
                <ProductsToolbar />
                <ProductsTable products={products} locale={locale} />
            </div>
        </div>
    )
}
