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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"
import { confirmProductAddition, reportScrapingIssue } from "@/app/[locale]/dashboard/products/actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ProductVerificationDialogProps {
    open: boolean
    onClose: () => void
    data: {
        sku: string
        competitors: any[]
        count: number
    }
}

export function ProductVerificationDialog({ open, onClose, data }: ProductVerificationDialogProps) {
    const [loading, setLoading] = useState(false)
    const [showReportForm, setShowReportForm] = useState(false)
    const [reportIssue, setReportIssue] = useState("")
    const [expectedSku, setExpectedSku] = useState("")
    const { toast } = useToast()
    const router = useRouter()

    // Get primary product data (first competitor)
    const primaryProduct = data.competitors[0]
    const competitorUrls = data.competitors.map(c => c.url)

    const handleConfirm = async () => {
        setLoading(true)

        try {
            const result = await confirmProductAddition({
                name: primaryProduct.name,
                sku: data.sku,
                price: primaryProduct.price,
                currency: primaryProduct.currency,
                imageUrl: primaryProduct.imageUrl,
                description: primaryProduct.description,
                originalPrice: primaryProduct.originalPrice,
                competitorUrls: competitorUrls,
                platform: primaryProduct.platform
            })

            if (result.success) {
                toast({
                    title: "Product Added",
                    description: `Successfully added ${primaryProduct.name} with ${data.count} competitor${data.count > 1 ? 's' : ''}`,
                })
                onClose()
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to add product",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add product",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleReport = async () => {
        if (!reportIssue.trim()) {
            toast({
                title: "Error",
                description: "Please describe the issue",
                variant: "destructive"
            })
            return
        }

        setLoading(true)

        try {
            const result = await reportScrapingIssue({
                productUrl: primaryProduct.url,
                reportedSku: data.sku,
                expectedSku: expectedSku || undefined,
                productName: primaryProduct.name,
                issue: reportIssue
            })

            if (result.success) {
                toast({
                    title: "Report Submitted",
                    description: "Thank you! Admin will review and improve the scraper.",
                })
                onClose()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to submit report",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit report",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Verify Product Information</DialogTitle>
                    <DialogDescription>
                        Found {data.count} product{data.count > 1 ? 's' : ''} with SKU: {data.sku}. Please verify the information is correct.
                    </DialogDescription>
                </DialogHeader>

                {!showReportForm ? (
                    <>
                        <div className="space-y-4">
                            {/* Primary Product Info */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex gap-4">
                                        {primaryProduct.imageUrl && (
                                            <div className="relative w-24 h-24 flex-shrink-0">
                                                <Image
                                                    src={primaryProduct.imageUrl}
                                                    alt={primaryProduct.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold text-lg">{primaryProduct.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">SKU: {data.sku}</Badge>
                                                <Badge variant="outline">{primaryProduct.platform}</Badge>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold">
                                                    {primaryProduct.price} {primaryProduct.currency}
                                                </span>
                                                {primaryProduct.originalPrice && primaryProduct.originalPrice > primaryProduct.price && (
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        {primaryProduct.originalPrice} {primaryProduct.currency}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Competitor Stores */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">
                                    Found in {data.count} Store{data.count > 1 ? 's' : ''}
                                </Label>
                                <div className="space-y-2">
                                    {data.competitors.map((competitor, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {competitor.platform}
                                                            </Badge>
                                                            <span className="text-sm font-medium">
                                                                {competitor.price} {competitor.currency}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                                            {competitor.url}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a href={competitor.url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Verification Question */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-blue-900">Is this information correct?</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                If the product details or SKU don&apos;t match what you expected, please report it so we can improve our scraper.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowReportForm(true)}
                            >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Report Issue
                            </Button>
                            <Button onClick={handleConfirm} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Confirm & Add Product
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <div className="space-y-4">
                            <Card className="border-orange-200 bg-orange-50">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-orange-900">Report Scraping Issue</p>
                                            <p className="text-sm text-orange-700 mt-1">
                                                Help us improve! Describe what&apos;s wrong with the scraped data.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="expected-sku">Expected SKU (Optional)</Label>
                                    <Input
                                        id="expected-sku"
                                        placeholder="What SKU did you expect?"
                                        value={expectedSku}
                                        onChange={(e) => setExpectedSku(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="issue">Describe the Issue *</Label>
                                    <Textarea
                                        id="issue"
                                        placeholder="E.g., 'The SKU is incorrect, it should be XYZ123' or 'The price is wrong' or 'Wrong product entirely'"
                                        value={reportIssue}
                                        onChange={(e) => setReportIssue(e.target.value)}
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowReportForm(false)}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            <Button onClick={handleReport} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Report"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
