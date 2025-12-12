'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Loader2 } from "lucide-react"
import { addProductBySKU } from "@/app/[locale]/dashboard/products/actions"
import { useToast } from "@/hooks/use-toast"
import { ProductVerificationDialog } from "./product-verification-dialog"

interface AddProductDialogProps {
    onAdd: (url: string) => void
}

export function AddProductDialog({ onAdd }: AddProductDialogProps) {
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState("")
    const [sku, setSku] = useState("")
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"url" | "sku">("url")
    const [verificationData, setVerificationData] = useState<any>(null)
    const [showVerification, setShowVerification] = useState(false)
    const { toast } = useToast()

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        await onAdd(url)
        setLoading(false)
        setOpen(false)
        setUrl("")
    }

    const handleSkuSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await addProductBySKU(sku)

            if (result.success && result.competitors) {
                // Show verification dialog
                setVerificationData({
                    sku: sku,
                    competitors: result.competitors,
                    count: result.count
                })
                setShowVerification(true)
                setOpen(false)
            } else {
                toast({
                    title: "No Products Found",
                    description: result.error || "No products found with this SKU in Saudi Arabia stores",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to search for products",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleVerificationClose = () => {
        setShowVerification(false)
        setVerificationData(null)
        setSku("")
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                        <DialogDescription>
                            Add a product by URL or search by SKU across Saudi Arabia stores
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={mode} onValueChange={(v) => setMode(v as "url" | "sku")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="url">By URL</TabsTrigger>
                            <TabsTrigger value="sku">By SKU</TabsTrigger>
                        </TabsList>

                        <TabsContent value="url">
                            <form onSubmit={handleUrlSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="url">Product URL</Label>
                                        <Input
                                            id="url"
                                            placeholder="https://salla.sa/..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            We&apos;ll automatically fetch product details and extract the SKU
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            "Add Product"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </TabsContent>

                        <TabsContent value="sku">
                            <form onSubmit={handleSkuSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="sku">Product SKU</Label>
                                        <Input
                                            id="sku"
                                            placeholder="Enter SKU or product code"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            required
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Search all Saudi Arabia stores for products with this SKU
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            "Search Products"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {verificationData && (
                <ProductVerificationDialog
                    open={showVerification}
                    onClose={handleVerificationClose}
                    data={verificationData}
                />
            )}
        </>
    )
}

