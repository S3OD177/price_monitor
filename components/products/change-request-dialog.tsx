'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { submitChangeRequest } from '@/app/[locale]/dashboard/products/[id]/actions'
import { Edit } from 'lucide-react'

interface ChangeRequestDialogProps {
    competitor: any
}

export function ChangeRequestDialog({ competitor }: ChangeRequestDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        proposedName: competitor.name,
        proposedSku: competitor.sku || '',
        proposedPrice: competitor.price,
        proposedCurrency: competitor.currency,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await submitChangeRequest({
                competitorId: competitor.$id,
                ...formData
            })

            if (result.success) {
                toast({
                    title: "Request Submitted",
                    description: "Your edit suggestion has been submitted for review.",
                })
                setOpen(false)
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to submit request",
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" title="Suggest Edit">
                    <Edit className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Suggest Edit</DialogTitle>
                    <DialogDescription>
                        Help us improve our data. Suggest changes for this product.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.proposedName}
                            onChange={(e) => setFormData({ ...formData, proposedName: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sku" className="text-right">
                            SKU
                        </Label>
                        <Input
                            id="sku"
                            value={formData.proposedSku}
                            onChange={(e) => setFormData({ ...formData, proposedSku: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.proposedPrice}
                            onChange={(e) => setFormData({ ...formData, proposedPrice: parseFloat(e.target.value) })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currency" className="text-right">
                            Currency
                        </Label>
                        <Input
                            id="currency"
                            value={formData.proposedCurrency}
                            onChange={(e) => setFormData({ ...formData, proposedCurrency: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
