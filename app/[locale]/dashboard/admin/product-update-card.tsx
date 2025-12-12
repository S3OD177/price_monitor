'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { approveProductUpdate, rejectProductUpdate } from './actions'
import { Loader2, Check, X, ArrowRight, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProductUpdateCardProps {
    request: {
        $id: string
        productId: string
        userId: string
        productUrl: string
        currentData: string // JSON string
        proposedData: string // JSON string
        changedFields: string // JSON string
        reason?: string
        createdAt: string
    }
}

export function ProductUpdateCard({ request }: ProductUpdateCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [rejecting, setRejecting] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [markVerified, setMarkVerified] = useState(true)

    const currentData = JSON.parse(request.currentData)
    const proposedData = JSON.parse(request.proposedData)
    const changedFields = JSON.parse(request.changedFields)

    const handleApprove = async () => {
        setLoading(true)
        const result = await approveProductUpdate(request.$id, markVerified)
        setLoading(false)
        if (result.success) {
            router.refresh()
        }
    }

    const handleReject = async () => {
        if (!rejecting) {
            setRejecting(true)
            return
        }

        if (!rejectionReason.trim()) return

        setLoading(true)
        const result = await rejectProductUpdate(request.$id, rejectionReason)
        setLoading(false)
        if (result.success) {
            setRejecting(false)
            router.refresh()
        }
    }

    const renderDiff = (field: string, label: string) => {
        if (!changedFields.includes(field)) return null

        const current = currentData[field]
        const proposed = proposedData[field]

        return (
            <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center text-sm border-b py-2 last:border-0">
                <div className="text-muted-foreground break-all">
                    <span className="font-semibold text-xs uppercase block mb-1">{label} (Current)</span>
                    {field === 'imageUrl' ? (
                        <div className="relative h-16 w-16 border rounded overflow-hidden">
                            <Image src={current || ''} alt="Current" fill className="object-cover" />
                        </div>
                    ) : (
                        current || <span className="italic">Empty</span>
                    )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium break-all">
                    <span className="font-semibold text-xs uppercase block mb-1 text-blue-600">{label} (Proposed)</span>
                    {field === 'imageUrl' ? (
                        <div className="relative h-16 w-16 border rounded overflow-hidden">
                            <Image src={proposed || ''} alt="Proposed" fill className="object-cover" />
                        </div>
                    ) : (
                        proposed || <span className="italic">Empty</span>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-base">Update Request</CardTitle>
                        <CardDescription className="text-xs">
                            Submitted on {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {changedFields.length} Changes
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {request.reason && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                        <span className="font-semibold">User Reason:</span> {request.reason}
                    </div>
                )}

                <div className="border rounded-md p-3 space-y-1">
                    {renderDiff('name', 'Name')}
                    {renderDiff('sku', 'SKU')}
                    {renderDiff('description', 'Description')}
                    {renderDiff('imageUrl', 'Image')}
                </div>

                {rejecting && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                        <Label htmlFor="rejection-reason">Rejection Reason</Label>
                        <Textarea
                            id="rejection-reason"
                            placeholder="Why is this request being rejected?"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>
                )}

                {!rejecting && (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="verified"
                            checked={markVerified}
                            onCheckedChange={(checked) => setMarkVerified(checked as boolean)}
                        />
                        <Label htmlFor="verified" className="text-sm font-normal">
                            Mark product as <span className="font-semibold text-green-600">Verified</span> upon approval
                        </Label>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0">
                {rejecting ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setRejecting(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleReject} disabled={loading || !rejectionReason.trim()}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Rejection'}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="outline" size="sm" onClick={handleReject} disabled={loading}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button size="sm" onClick={handleApprove} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                </>
                            )}
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
