'use client'

import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteProduct } from '@/app/[locale]/dashboard/products/actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface DeleteProductButtonProps {
    productId: string
    productName: string
    redirectAfterDelete?: boolean
    locale?: string
}

export function DeleteProductButton({ productId, productName, redirectAfterDelete = false, locale = 'en' }: DeleteProductButtonProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent dialog from closing immediately
        setLoading(true)

        try {
            const result = await deleteProduct(productId)

            if (result.success) {
                toast({
                    title: "Product deleted",
                    description: `Successfully deleted ${productName}`,
                })

                if (redirectAfterDelete) {
                    router.push(`/${locale}/dashboard/products`)
                } else {
                    router.refresh()
                }
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to delete product",
                    variant: "destructive",
                })
                setLoading(false)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            })
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{productName}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
