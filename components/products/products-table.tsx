'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
    $id: string
    name: string
    sku?: string
    platform: string
    price: number
    currency: string
    stock: number
    imageUrl?: string
    url?: string
}

interface ProductsTableProps {
    products: Product[]
    locale: string
}

export function ProductsTable({ products, locale }: ProductsTableProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed bg-muted/50">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or sync your store.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-md border shadow-sm bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.$id} className="hover:bg-muted/50">
                            <TableCell>
                                {product.imageUrl ? (
                                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground border">
                                        No Img
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/${locale}/dashboard/products/${product.$id}`} className="hover:underline">
                                    <div className="max-w-[200px] truncate" title={product.name}>
                                        {product.name}
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{product.sku || '-'}</TableCell>
                            <TableCell>
                                <Badge variant={product.platform === 'salla' ? 'default' : 'secondary'} className="capitalize">
                                    {product.platform}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                                {product.price} <span className="text-muted-foreground text-xs">{product.currency}</span>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={product.stock > 0 ? "border-green-500 text-green-500 bg-green-500/10" : "border-red-500 text-red-500 bg-red-500/10"}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <Link href={`/${locale}/dashboard/products/${product.$id}`}>
                                            <DropdownMenuItem>
                                                View Details
                                            </DropdownMenuItem>
                                        </Link>
                                        {product.url && (
                                            <a href={product.url} target="_blank" rel="noopener noreferrer">
                                                <DropdownMenuItem>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    View on Store
                                                </DropdownMenuItem>
                                            </a>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
