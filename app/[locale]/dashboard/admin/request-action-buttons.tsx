'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { approveRequest, rejectRequest } from './actions'
import { useToast } from '@/hooks/use-toast'

export function RequestActionButtons({ request }: { request: any }) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleApprove = async () => {
        setLoading(true)
        try {
            const result = await approveRequest(request.$id, request.competitorId, {
                proposedName: request.proposedName,
                proposedSku: request.proposedSku,
                proposedPrice: request.proposedPrice,
                proposedCurrency: request.proposedCurrency
            })

            if (result.success) {
                toast({ title: "Approved", description: "Request approved and data updated." })
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to approve", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        setLoading(true)
        try {
            const result = await rejectRequest(request.$id)

            if (result.success) {
                toast({ title: "Rejected", description: "Request rejected." })
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" })
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to reject", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={handleApprove} disabled={loading}>
                <Check className="h-4 w-4 mr-1" />
                Approve
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={handleReject} disabled={loading}>
                <X className="h-4 w-4 mr-1" />
                Reject
            </Button>
        </div>
    )
}
