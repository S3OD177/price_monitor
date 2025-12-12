'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Pencil, Info, AlertTriangle, Clock } from 'lucide-react'
import { updateProduct } from '@/app/[locale]/dashboard/products/actions'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

interface EditProductDialogProps {
    product: {
        $id: string
        name: string
        price: number
        currency: string
        status: string
        sku?: string
        imageUrl?: string
        description?: string
        lastScraped?: string
        updatedAt?: string
    }
}

export function EditProductDialog({ product }: EditProductDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: product.name,
        sku: product.sku || '',
        imageUrl: product.imageUrl || '',
        description: product.description || '',
        status: product.status,
        submitToCommunity: false,
        reason: ''
    })

    const originalSku = product.sku || ''
    const showSkuWarning = formData.sku !== originalSku && formData.sku.length > 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await updateProduct(product.$id, {
            name: formData.name,
            sku: formData.sku,
            imageUrl: formData.imageUrl,
            description: formData.description,
            status: formData.status,
            submitToCommunity: formData.submitToCommunity,
            reason: formData.reason
        })

        setLoading(false)

        if (result.success) {
            setOpen(false)
            router.refresh()
        }
    }

    const lastUpdated = product.lastScraped || product.updatedAt
    const formattedLastUpdated = lastUpdated
        ? new Date(lastUpdated).toLocaleString()
        : 'Never'

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update product details. Changes are saved immediately to your dashboard.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                        </div>

                        {showSkuWarning && (
                            <Alert variant="destructive" className="py-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    Changing SKU may affect competitor matching. Consider re-running competitor search.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Price is automatically updated by scraping</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="number"
                                        value={product.price}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                                        {product.currency}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Last updated: {formattedLastUpdated}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Additional Details</h3>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <div className="flex gap-4">
                                <Input
                                    id="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="flex-1"
                                />
                                {formData.imageUrl && (
                                    <div className="relative h-10 w-10 border rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                // Hide image on error
                                                (e.target as HTMLImageElement).style.display = 'none'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Community Submission */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="community"
                                checked={formData.submitToCommunity}
                                onCheckedChange={(checked) => setFormData({ ...formData, submitToCommunity: checked as boolean })}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="community"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Submit changes to community database
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Help other users by sharing accurate product data. Submissions require admin approval.
                                </p>
                            </div>
                        </div>

                        {formData.submitToCommunity && (
                            <div className="space-y-2 pl-6">
                                <Label htmlFor="reason">Reason for changes (Optional)</Label>
                                <Input
                                    id="reason"
                                    placeholder="E.g., Corrected SKU, Updated description"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                                <Alert className="bg-blue-50 border-blue-200">
                                    <Info className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-700 text-xs">
                                        Your submission will be reviewed by an admin before updating the community database.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
